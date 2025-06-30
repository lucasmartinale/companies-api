import { SeedDatabaseUC } from 'src/application/use-cases/SeedDatabaseUC';
import { ICompanyRepository } from 'src/application/interfaces/ICompanyRepository';
import { ITransferRepository } from 'src/application/interfaces/ITransferRepository';

describe('SeedDatabaseUC', () => {
	let mockCompanyRepository: jest.Mocked<ICompanyRepository>;
	let mockTransferRepository: jest.Mocked<ITransferRepository>;
	let useCase: SeedDatabaseUC;

	beforeEach(() => {
		mockCompanyRepository = {
			deleteAll: jest.fn(),
			saveMany: jest.fn(),
			createCompany: jest.fn(),
			findOneByCuit: jest.fn(),
			findAllWithTransfersSince: jest.fn(),
			findAllJoinedSince: jest.fn(),
		};

		mockTransferRepository = {
			deleteAll: jest.fn(),
			saveMany: jest.fn(),
		};

		useCase = new SeedDatabaseUC(mockCompanyRepository, mockTransferRepository);
	});

	it('should clear and populate the database with companies and transfers', async () => {
		await useCase.execute();

		expect(mockTransferRepository.deleteAll).toHaveBeenCalledTimes(1);
		expect(mockCompanyRepository.deleteAll).toHaveBeenCalledTimes(1);

		expect(mockCompanyRepository.saveMany).toHaveBeenCalledTimes(1);
		const companies = mockCompanyRepository.saveMany.mock.calls[0]![0];
		expect(companies).toHaveLength(3);

		expect(mockTransferRepository.saveMany).toHaveBeenCalledTimes(1);
		const transfers = mockTransferRepository.saveMany.mock.calls[0]![0];
		expect(transfers).toHaveLength(3);
	});

	it('should propagate errors if any happend during the process', async () => {
		mockTransferRepository.deleteAll.mockRejectedValue(new Error('Error deleting transfers'));

		await expect(useCase.execute()).rejects.toThrow('Error deleting transfers');
	});
});
