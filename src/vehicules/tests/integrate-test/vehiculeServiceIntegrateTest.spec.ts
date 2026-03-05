// src/vehicules/tests/integration/vehicule.controller.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculeController } from '../../vehicule.controller';
import { VehiculeService } from '../../vehicule.service';
import { Vehicule } from '../../entity/vehicule.entity';
import { CreateVehiculeDto } from '../../dtos/createVehicule.dto';
import { UpdateVehiculeDto } from '../../dtos/updateVehicule.dto';

describe('VehiculeController Integration Tests', () => {
  let app: INestApplication;
  let repository: Repository<Vehicule>;
  let moduleRef: TestingModule;

  const createVehiculeDto: CreateVehiculeDto = {
    registrationNumber: 'ABC-1234',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    vehicleType: 'Berline',
    color: 'Red',
    purchaseDate: new Date('2020-01-01'),
    assignedDate: new Date('2020-02-01'),
    currentDriverId: '123e4567-e89b-12d3-a456-426614174000',
    status: 'available',
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Vehicule],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([Vehicule]),
      ],
      controllers: [VehiculeController],
      providers: [VehiculeService],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    await app.init();

    repository = moduleRef.get<Repository<Vehicule>>(getRepositoryToken(Vehicule));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  describe('POST /vehicules/create', () => {
    it('should create a new vehicule', () => {
      return request(app.getHttpServer())
        .post('/vehicules/create')
        .send(createVehiculeDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.id).toBeDefined();
          expect(res.body.registrationNumber).toBe(createVehiculeDto.registrationNumber);
          expect(res.body.make).toBe(createVehiculeDto.make);
          expect(res.body.createdAt).toBeDefined();
        });
    });

    it('should return 400 when registration number is invalid', () => {
      const invalidDto = {
        ...createVehiculeDto,
        registrationNumber: 'invalid@123',
      };

      return request(app.getHttpServer())
        .post('/vehicules/create')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 when required fields are missing', () => {
      const invalidDto = {
        registrationNumber: 'ABC-1234',
        // missing make, model, etc.
      };

      return request(app.getHttpServer())
        .post('/vehicules/create')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 when year is invalid', () => {
      const invalidDto = {
        ...createVehiculeDto,
        year: 1800, // Trop ancien
      };

      return request(app.getHttpServer())
        .post('/vehicules/create')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 when vehicleType is invalid', () => {
      const invalidDto = {
        ...createVehiculeDto,
        vehicleType: 'InvalidType',
      };

      return request(app.getHttpServer())
        .post('/vehicules/create')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('GET /vehicules/all', () => {
    it('should return all vehicules', async () => {
      // Arrange
      await request(app.getHttpServer())
        .post('/vehicules/create')
        .send(createVehiculeDto);

      await request(app.getHttpServer())
        .post('/vehicules/create')
        .send({
          ...createVehiculeDto,
          registrationNumber: 'DEF-5678',
        });

      // Act & Assert
      return request(app.getHttpServer())
        .get('/vehicules/all')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
          expect(res.body[0].registrationNumber).toBe('ABC-1234');
          expect(res.body[1].registrationNumber).toBe('DEF-5678');
        });
    });

    it('should return empty array when no vehicules exist', () => {
      return request(app.getHttpServer())
        .get('/vehicules/all')
        .expect(200)
        .expect([]);
    });
  });

  describe('GET /vehicules/:id', () => {
    it('should return a vehicule by id', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/vehicules/create')
        .send(createVehiculeDto);
      
      const vehiculeId = createResponse.body.id;

      // Act & Assert
      return request(app.getHttpServer())
        .get(`/vehicules/${vehiculeId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(vehiculeId);
          expect(res.body.registrationNumber).toBe(createVehiculeDto.registrationNumber);
        });
    });

    it('should return 404 when vehicule not found', () => {
      return request(app.getHttpServer())
        .get('/vehicules/11111111-1111-1111-1111-111111111111')
        .expect(404);
    });

    it('should return 400 when id is not a valid UUID', () => {
      return request(app.getHttpServer())
        .get('/vehicules/123') // UUID invalide
        .expect(400);
    });
  });

  describe('PUT /vehicules/:id', () => {
    it('should update a vehicule', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/vehicules/create')
        .send(createVehiculeDto);
      
      const vehiculeId = createResponse.body.id;
      const updateDto: UpdateVehiculeDto = {
        make: 'Toyota Updated',
        model: 'Camry',
        color: 'Blue',
      };

      // Act & Assert
      return request(app.getHttpServer())
        .put(`/vehicules/${vehiculeId}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(vehiculeId);
          expect(res.body.make).toBe('Toyota Updated');
          expect(res.body.model).toBe('Camry');
          expect(res.body.color).toBe('Blue');
          expect(res.body.registrationNumber).toBe(createVehiculeDto.registrationNumber);
        });
    });

    it('should return 404 when updating non-existent vehicule', () => {
      return request(app.getHttpServer())
        .put('/vehicules/11111111-1111-1111-1111-111111111111')
        .send({ color: 'Blue' })
        .expect(404);
    });

    it('should return 400 when updating with invalid data', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/vehicules/create')
        .send(createVehiculeDto);
      
      const vehiculeId = createResponse.body.id;

      // Act & Assert
      return request(app.getHttpServer())
        .put(`/vehicules/${vehiculeId}`)
        .send({ year: 1800 }) // Année invalide
        .expect(400);
    });

    it('should update only status field', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/vehicules/create')
        .send(createVehiculeDto);
      
      const vehiculeId = createResponse.body.id;

      // Act & Assert
      return request(app.getHttpServer())
        .put(`/vehicules/${vehiculeId}`)
        .send({ status: 'maintenance' })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('maintenance');
          expect(res.body.make).toBe(createVehiculeDto.make);
        });
    });
  });

  describe('DELETE /vehicules/:id', () => {
    it('should delete a vehicule', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/vehicules/create')
        .send(createVehiculeDto);
      
      const vehiculeId = createResponse.body.id;

      // Act & Assert
      await request(app.getHttpServer())
        .delete(`/vehicules/${vehiculeId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe(`Vehicule with ID ${vehiculeId} has been deleted`);
        });

      // Vérifier que le véhicule a bien été supprimé
      return request(app.getHttpServer())
        .get(`/vehicules/${vehiculeId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent vehicule', () => {
      return request(app.getHttpServer())
        .delete('/vehicules/11111111-1111-1111-1111-111111111111')
        .expect(404);
    });
  });

  describe('Validation des DTOs', () => {
    it('should validate registration number format', async () => {
      const invalidDto = {
        ...createVehiculeDto,
        registrationNumber: 'abc-123', // Lettres minuscules non autorisées
      };

      return request(app.getHttpServer())
        .post('/vehicules/create')
        .send(invalidDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([
              expect.stringContaining('numéro d\'immatriculation'),
            ]),
          );
        });
    });

    it('should validate vehicle type enum', async () => {
      const invalidDto = {
        ...createVehiculeDto,
        vehicleType: 'Camion', // Type non valide
      };

      return request(app.getHttpServer())
        .post('/vehicules/create')
        .send(invalidDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([
              expect.stringContaining('Type de véhicule non valide'),
            ]),
          );
        });
    });

    it('should validate status enum', async () => {
      const invalidDto = {
        ...createVehiculeDto,
        status: 'invalid-status',
      };

      return request(app.getHttpServer())
        .post('/vehicules/create')
        .send(invalidDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([
              expect.stringContaining('statut doit être'),
            ]),
          );
        });
    });
  });

  describe('Scénarios complexes', () => {
    it('should handle complete vehicule lifecycle', async () => {
      // 1. Créer un véhicule
      const createResponse = await request(app.getHttpServer())
        .post('/vehicules/create')
        .send(createVehiculeDto);
      
      expect(createResponse.status).toBe(201);
      const vehiculeId = createResponse.body.id;

      // 2. Récupérer le véhicule par ID
      const getResponse = await request(app.getHttpServer())
        .get(`/vehicules/${vehiculeId}`);
      
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.id).toBe(vehiculeId);

      // 3. Mettre à jour le véhicule
      const updateResponse = await request(app.getHttpServer())
        .put(`/vehicules/${vehiculeId}`)
        .send({ status: 'in-use' });
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.status).toBe('in-use');

      // 4. Récupérer tous les véhicules
      const allResponse = await request(app.getHttpServer())
        .get('/vehicules/all');
      
      expect(allResponse.status).toBe(200);
      expect(allResponse.body.length).toBe(1);
      expect(allResponse.body[0].status).toBe('in-use');

      // 5. Supprimer le véhicule
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/vehicules/${vehiculeId}`);
      
      expect(deleteResponse.status).toBe(200);

      // 6. Vérifier que le véhicule n'existe plus
      const finalGetResponse = await request(app.getHttpServer())
        .get(`/vehicules/${vehiculeId}`);
      
      expect(finalGetResponse.status).toBe(404);
    });

    it('should handle multiple vehicules operations', async () => {
      // Créer plusieurs véhicules
      const vehicule1 = await request(app.getHttpServer())
        .post('/vehicules/create')
        .send(createVehiculeDto);

      const vehicule2 = await request(app.getHttpServer())
        .post('/vehicules/create')
        .send({
          ...createVehiculeDto,
          registrationNumber: 'DEF-5678',
        });

      const vehicule3 = await request(app.getHttpServer())
        .post('/vehicules/create')
        .send({
          ...createVehiculeDto,
          registrationNumber: 'GHI-9012',
        });

      // Modifier certains véhicules
      await request(app.getHttpServer())
        .put(`/vehicules/${vehicule1.body.id}`)
        .send({ status: 'maintenance' });

      await request(app.getHttpServer())
        .put(`/vehicules/${vehicule3.body.id}`)
        .send({ color: 'Black' });

      // Supprimer un véhicule
      await request(app.getHttpServer())
        .delete(`/vehicules/${vehicule2.body.id}`);

      // Vérifier l'état final
      const allVehicules = await request(app.getHttpServer())
        .get('/vehicules/all');

      expect(allVehicules.body.length).toBe(2);
      expect(allVehicules.body.find(v => v.id === vehicule1.body.id).status).toBe('maintenance');
      expect(allVehicules.body.find(v => v.id === vehicule3.body.id).color).toBe('Black');
      expect(allVehicules.body.find(v => v.id === vehicule2.body.id)).toBeUndefined();
    });
  });
});
