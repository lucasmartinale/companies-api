import { CreateCompanyUC } from 'src/application/use-cases/CreateCompanyUC';
import { ICompanyRepository } from 'src/application/interfaces/ICompanyRepository';
import { CompanyEntity } from 'src/domain/entities/CompanyEntity';
import { ConflictException } from '@nestjs/common';
import { CompanyTypeEnum } from 'src/domain/enums/CompanyTypeEnum';

describe('CreateCompanyUC', () => {
	let mockCompanyRepository: jest.Mocked<ICompanyRepository>;
	let useCase: CreateCompanyUC;

	const companyData: CompanyEntity = {
		id: '77ea0073-2f31-4e12-849c-320e623879c7',
		cuit: '20123456789',
		name: 'Empresa Test',
		type: CompanyTypeEnum.PYME,
		createdAt: new Date(),
		joinedAt: new Date(),
		transfersSent: [],
		transfersReceived: [],
	};

	beforeEach(() => {
		mockCompanyRepository = {
			findOneByCuit: jest.fn(),
			createCompany: jest.fn(),
			findAllWithTransfersSince: jest.fn(),
			findAllJoinedSince: jest.fn(),
			deleteAll: jest.fn(),
			saveMany: jest.fn(),
		};

		useCase = new CreateCompanyUC(mockCompanyRepository);
	});

	it('should create a company if the CUIT does not exist', async () => {
		mockCompanyRepository.findOneByCuit.mockResolvedValue(null);
		mockCompanyRepository.createCompany.mockResolvedValue(companyData);

		const result = await useCase.execute(companyData);

		expect(mockCompanyRepository.findOneByCuit).toHaveBeenCalledWith(companyData.cuit);
		expect(mockCompanyRepository.createCompany).toHaveBeenCalledWith(companyData);
		expect(result).toEqual(companyData);
	});

	it('should throw ConflictException if the CUIT already exists', async () => {
		mockCompanyRepository.findOneByCuit.mockResolvedValue(companyData);

		await expect(useCase.execute(companyData)).rejects.toThrow(ConflictException);
		expect(mockCompanyRepository.createCompany).not.toHaveBeenCalled();
	});

	it('should not call createCompany if the CUIT already exists', async () => {
		mockCompanyRepository.findOneByCuit.mockResolvedValue(companyData);

		await expect(useCase.execute(companyData)).rejects.toThrow(ConflictException);
		expect(mockCompanyRepository.createCompany).not.toHaveBeenCalled();
	});

	it('should propagate unexpected errors from the repository', async () => {
		mockCompanyRepository.findOneByCuit.mockRejectedValue(new Error('Unexpected database error'));

		await expect(useCase.execute(companyData)).rejects.toThrow('Unexpected database error');
	});
});
