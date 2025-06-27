import { CompanyController } from 'src/infrastructure/primary-adapters/http/controllers/company/CompanyController';
import { CreateCompanyUC } from 'src/application/use-cases/CreateCompanyUC';
import { GetCompaniesWithRecentAdhesionsUC } from 'src/application/use-cases/GetCompaniesWithRecentAdhesionsUC';
import { GetCompaniesWithRecentTransfersUC } from 'src/application/use-cases/GetCompaniesWithRecentTransfersUC';
import { CreateCompanyRequest } from 'src/infrastructure/primary-adapters/http/controllers/company/request/CreateCompanyRequest';
import { CompanyTypeEnum } from 'src/domain/enums/CompanyTypeEnum';
import { CompanyEntity } from 'src/domain/entities/CompanyEntity';

describe('CompanyController', () => {
	let controller: CompanyController;
	let createCompanyUC: jest.Mocked<CreateCompanyUC>;
	let getCompaniesWithRecentAdhesionsUC: jest.Mocked<GetCompaniesWithRecentAdhesionsUC>;
	let getCompaniesWithRecentTransfersUC: jest.Mocked<GetCompaniesWithRecentTransfersUC>;

	beforeEach(() => {
		createCompanyUC = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<CreateCompanyUC>;

		getCompaniesWithRecentAdhesionsUC = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<GetCompaniesWithRecentAdhesionsUC>;

		getCompaniesWithRecentTransfersUC = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<GetCompaniesWithRecentTransfersUC>;

		controller = new CompanyController(
			createCompanyUC,
			getCompaniesWithRecentAdhesionsUC,
			getCompaniesWithRecentTransfersUC,
		);
	});

	describe('create', () => {
		it('should call to the UC and return a CreateCompanyResponse', async () => {
			const request = new CreateCompanyRequest();
			request.cuit = '20123456789';
			request.name = 'Test Company';
			request.type = CompanyTypeEnum.PYME;

			const companyEntity: CompanyEntity = {
				id: 'a263667b-b049-4724-8c25-f6fd29a7cf3c',
				cuit: request.cuit,
				name: request.name,
				type: request.type,
				createdAt: new Date('2024-01-01T00:00:00Z'),
				joinedAt: new Date('2024-01-01T00:00:00Z'),
				transfersSent: [],
				transfersReceived: [],
			};

			jest.spyOn(request, 'toEntity').mockReturnValue(companyEntity);
			createCompanyUC.execute.mockResolvedValue(companyEntity);

			const response = await controller.create(request);

			expect(createCompanyUC.execute).toHaveBeenCalledWith(companyEntity);
			expect(response).toEqual({
				id: companyEntity.id,
				cuit: companyEntity.cuit,
				name: companyEntity.name,
				type: companyEntity.type,
			});
		});
	});

	describe('getRecentAdhesions', () => {
		it('should call to the UC and return companies with recent adhesions', async () => {
			const companies: CompanyEntity[] = [
				{
					id: 'a263667b-b049-4724-8c25-f6fd29a7cf3c',
					cuit: '20112223334',
					name: 'Test Company',
					type: CompanyTypeEnum.PYME,
					createdAt: new Date(),
					joinedAt: new Date('2025-06-01T00:00:00Z'),
					transfersSent: [],
					transfersReceived: [],
				},
			];

			getCompaniesWithRecentAdhesionsUC.execute.mockResolvedValue(companies);

			const response = await controller.getRecentAdhesions();

			expect(getCompaniesWithRecentAdhesionsUC.execute).toHaveBeenCalled();
			expect(response.companies).toEqual([
				{
					id: companies[0]?.id,
					cuit: companies[0]?.cuit,
					name: companies[0]?.name,
					type: companies[0]?.type,
					joinedAt: companies[0]?.joinedAt,
				},
			]);
		});
	});

	describe('getRecentTransfers', () => {
		it('should call to the UC and return companies with recent transfers', async () => {
			const companies: CompanyEntity[] = [
				{
					id: 'uuid-trf-1',
					cuit: '20998887776',
					name: 'Transfer Co',
					type: CompanyTypeEnum.CORPORATE,
					createdAt: new Date(),
					joinedAt: new Date('2025-06-15T00:00:00Z'),
					transfersSent: [],
					transfersReceived: [],
				},
			];

			getCompaniesWithRecentTransfersUC.execute.mockResolvedValue(companies);

			const response = await controller.getRecentTransfers();

			expect(getCompaniesWithRecentTransfersUC.execute).toHaveBeenCalled();
			expect(response.companies).toEqual([
				{
					id: companies[0]?.id,
					cuit: companies[0]?.cuit,
					name: companies[0]?.name,
					type: companies[0]?.type,
					joinedAt: companies[0]?.joinedAt,
				},
			]);
		});
	});
});
