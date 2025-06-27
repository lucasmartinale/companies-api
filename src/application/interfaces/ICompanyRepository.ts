import { CompanyEntity } from 'src/domain/entities/CompanyEntity';

export const COMPANY_REPO = 'CompanyRepositoryInterface';

export interface ICompanyRepository {
	createCompany(companyEntity: CompanyEntity): Promise<CompanyEntity>;
	findOneByCuit(cuit: string): Promise<CompanyEntity | null>;
	findAllJoinedSince(date: Date): Promise<CompanyEntity[]>;
	findAllWithTransfersSince(date: Date): Promise<CompanyEntity[]>;
	deleteAll(): Promise<void>;
	saveMany(companies: CompanyEntity[]): Promise<void>;
}
