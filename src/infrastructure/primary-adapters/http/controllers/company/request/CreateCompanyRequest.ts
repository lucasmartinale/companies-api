import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { CompanyEntity } from 'src/domain/entities/CompanyEntity';
import { CompanyTypeEnum } from 'src/domain/enums/CompanyTypeEnum';

export class CreateCompanyRequest {
	@ApiProperty({ type: 'string', example: '20123456789' })
	@IsNotEmpty()
	@IsString()
	@Matches(/^\d{11}$/, {
		message: 'CUIT must be exactly 11 digits with no dashes',
	})
	public cuit: string;

	@ApiProperty({ example: 'Company example', description: 'Company name' })
	@IsNotEmpty()
	@IsString()
	public name: string;

	@ApiProperty({ example: 'pyme', description: 'Company type (pyme or corporate)' })
	@IsNotEmpty()
	@IsString()
	@IsEnum(CompanyTypeEnum, {
		message: `type must be a valid Company Type: ${Object.values(CompanyTypeEnum).join(', ')}`,
	})
	public type: CompanyTypeEnum;

	public toEntity(): CompanyEntity {
		const company = new CompanyEntity();

		company.cuit = this.cuit;
		company.name = this.name;
		company.type = this.type;
		company.joinedAt = new Date();

		return company;
	}
}
