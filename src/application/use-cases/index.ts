import { CreateCompanyUC } from './CreateCompanyUC';
import { GetCompaniesWithRecentAdhesionsUC } from './GetCompaniesWithRecentAdhesionsUC';
import { GetCompaniesWithRecentTransfersUC } from './GetCompaniesWithRecentTransfersUC';
import { SeedDatabaseUC } from './SeedDatabaseUC';

export const useCases = [
	CreateCompanyUC,
	GetCompaniesWithRecentAdhesionsUC,
	GetCompaniesWithRecentTransfersUC,
	SeedDatabaseUC,
];
