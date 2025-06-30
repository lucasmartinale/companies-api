import { GetCompaniesWithRecentTransfersUC } from 'src/application/use-cases/GetCompaniesWithRecentTransfersUC';
import { ICompanyRepository } from 'src/application/interfaces/ICompanyRepository';
import { CompanyEntity } from 'src/domain/entities/CompanyEntity';
import { CompanyTypeEnum } from 'src/domain/enums/CompanyTypeEnum';

describe('GetCompaniesWithRecentTransfersUC', () => {
	let mockCompanyRepository: jest.Mocked<ICompanyRepository>;
	let useCase: GetCompaniesWithRecentTransfersUC;

	const mockCompanies: CompanyEntity[] = [
		{
			id: 'a263667b-b049-4724-8c25-f6fd29a7cf3c',
			cuit: '20111111111',
			name: 'Empresa A',
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

		useCase = new GetCompaniesWithRecentTransfersUC(mockCompanyRepository);
	});

	it('should return companies with recent transfers', async () => {
		mockCompanyRepository.findAllWithTransfersSince.mockResolvedValue(mockCompanies);

		const result = await useCase.execute();

		expect(mockCompanyRepository.findAllWithTransfersSince).toHaveBeenCalledTimes(1);
		expect(result).toEqual(mockCompanies);
	});

	it('should return an empty list if there are no recent transfers', async () => {
		mockCompanyRepository.findAllWithTransfersSince.mockResolvedValue([]);

		const result = await useCase.execute();

		expect(result).toEqual([]);
	});

	it('should propagate errors if the repository fails', async () => {
		mockCompanyRepository.findAllWithTransfersSince.mockRejectedValue(new Error('Unexpected database error'));

		await expect(useCase.execute()).rejects.toThrow('Unexpected database error');
	});
});
