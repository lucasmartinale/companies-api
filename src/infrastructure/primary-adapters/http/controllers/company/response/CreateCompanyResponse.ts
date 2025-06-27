import { ApiProperty } from '@nestjs/swagger';
import { CompanyEntity } from 'src/domain/entities/CompanyEntity';

export class CreateCompanyResponse {
	@ApiProperty({ type: 'string', example: '4f721a1b-4cc2-4468-9f45-9ab7be9cb38d' })
	public id: string;

	@ApiProperty({ type: 'string', example: '20123456789' })
	public cuit: string;

	@ApiProperty({ type: 'string', example: 'Company Example' })
	public name: string;

	@ApiProperty({ type: 'string', example: 'pyme' })
	public type: string;

	constructor(companyEntity: CompanyEntity) {
		this.id = companyEntity.id;
		this.cuit = companyEntity.cuit;
		this.name = companyEntity.name;
		this.type = companyEntity.type;
	}
}
