import { GetCompaniesWithRecentAdhesionsUC } from 'src/application/use-cases/GetCompaniesWithRecentAdhesionsUC';
import { ICompanyRepository } from 'src/application/interfaces/ICompanyRepository';
import { CompanyEntity } from 'src/domain/entities/CompanyEntity';
import { CompanyTypeEnum } from 'src/domain/enums/CompanyTypeEnum';

describe('GetCompaniesWithRecentAdhesionsUC', () => {
	let mockCompanyRepository: jest.Mocked<ICompanyRepository>;
	let useCase: GetCompaniesWithRecentAdhesionsUC;

	const mockCompanies: CompanyEntity[] = [
		{
			id: '77ea0073-2f31-4e12-849c-320e623879c7',
			cuit: '20111111111',
			name: 'Empresa A',
			type: CompanyTypeEnum.PYME,
			createdAt: new Date(),
			joinedAt: new Date(),
			transfersSent: [],
			transfersReceived: [],
		},
		{
			id: 'a263667b-b049-4724-8c25-f6fd29a7cf3c',
			cuit: '20222222222',
			name: 'Empresa B',
			type: CompanyTypeEnum.PYME,
			createdAt: new Date(),
			joinedAt: new Date(),
			transfersSent: [],
			transfersReceived: [],
		},
	];

	beforeEach(() => {
		mockCompanyRepository = {
			findOneByCuit: jest.fn(),
			createCompany: jest.fn(),
			findAllWithTransfersSince: jest.fn(),
			findAllJoinedSince: jest.fn(),
			deleteAll: jest.fn(),
			saveMany: jest.fn(),
		};

		useCase = new GetCompaniesWithRecentAdhesionsUC(mockCompanyRepository);
	});

	it('should return the companies joined in the last month', async () => {
		mockCompanyRepository.findAllJoinedSince.mockResolvedValue(mockCompanies);

		const result = await useCase.execute();

		expect(mockCompanyRepository.findAllJoinedSince).toHaveBeenCalledTimes(1);
		expect(result).toEqual(mockCompanies);
	});

	it('should return an empty list if there are no recent companies', async () => {
		mockCompanyRepository.findAllJoinedSince.mockResolvedValue([]);

		const result = await useCase.execute();

		expect(result).toEqual([]);
	});

	it('should propagate errors if the repository fails', async () => {
		mockCompanyRepository.findAllJoinedSince.mockRejectedValue(new Error('Unexpected database error'));

		await expect(useCase.execute()).rejects.toThrow('Unexpected database error');
	});
});
