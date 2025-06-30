import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCompanyUC } from 'src/application/use-cases/CreateCompanyUC';
import { CreateCompanyRequest } from './request/CreateCompanyRequest';
import { CreateCompanyResponse } from './response/CreateCompanyResponse';
import { GetCompaniesWithRecentAdhesionsUC } from 'src/application/use-cases/GetCompaniesWithRecentAdhesionsUC';
import { GetRecentAdhesionsResponse } from './response/GetRecentAdhesionsResponse';
import { GetCompaniesWithRecentTransfersUC } from 'src/application/use-cases/GetCompaniesWithRecentTransfersUC';
import { GetRecentTransfersResponse } from './response/GetRecentTransfersResponse';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
	constructor(
		private readonly createCompanyUC: CreateCompanyUC,
		private readonly getCompaniesWithRecentAdhesionsUC: GetCompaniesWithRecentAdhesionsUC,
		private readonly getCompaniesWithRecentTransfers: GetCompaniesWithRecentTransfersUC,
	) {}

	@Post()
	@ApiOperation({ summary: 'Create a Company' })
	@ApiResponse({ type: [CreateCompanyResponse] })
	public async create(@Body() createCompanyRequest: CreateCompanyRequest): Promise<CreateCompanyResponse> {
		const newCompany = await this.createCompanyUC.execute(createCompanyRequest.toEntity());
		return new CreateCompanyResponse(newCompany);
	}

	@Get('recent-adhesions')
	@ApiOperation({ summary: 'Get the companies that joined in the last month.' })
	@ApiResponse({ type: [GetRecentAdhesionsResponse] })
	public async getRecentAdhesions(): Promise<GetRecentAdhesionsResponse> {
		const companies = await this.getCompaniesWithRecentAdhesionsUC.execute();
		return new GetRecentAdhesionsResponse(companies);
	}

	@Get('recent-transfers')
	@ApiOperation({ summary: 'Get the companies that made transfers in the last month.' })
	@ApiResponse({ type: [GetRecentTransfersResponse] })
	public async getRecentTransfers(): Promise<GetRecentTransfersResponse> {
		const companies = await this.getCompaniesWithRecentTransfers.execute();
		return new GetRecentTransfersResponse(companies);
	}
}
