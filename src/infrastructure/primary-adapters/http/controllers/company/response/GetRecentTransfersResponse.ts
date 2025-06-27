import { ApiProperty } from '@nestjs/swagger';
import { CompanyEntity } from 'src/domain/entities/CompanyEntity';

export class CompanyReturn {
	@ApiProperty({ type: 'string', example: '4f721a1b-4cc2-4468-9f45-9ab7be9cb38d' })
	public id: string;

	@ApiProperty({ type: 'string', example: '20123456789' })
	public cuit: string;

	@ApiProperty({ type: 'string', example: 'Company Example' })
	public name: string;

	@ApiProperty({ type: 'string', example: 'pyme' })
	public type: string;

	@ApiProperty({ type: 'string', format: 'date-time', example: '2025-06-28 20:25:04.570' })
	public joinedAt: Date;
}

export class GetRecentTransfersResponse {
	@ApiProperty({ type: CompanyReturn, isArray: true })
	public companies: CompanyReturn[];

	constructor(companyEntities: CompanyEntity[]) {
		this.companies = companyEntities.map((company) => {
			const companyReturn = new CompanyReturn();
			companyReturn.id = company.id;
			companyReturn.cuit = company.cuit;
			companyReturn.name = company.name;
			companyReturn.type = company.type;
			companyReturn.joinedAt = company.joinedAt;
			return companyReturn;
		});
	}
}
