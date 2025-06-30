import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, Index } from 'typeorm';
import { TransferEntity } from './TransferEntity';
import { CompanyTypeEnum } from '../enums/CompanyTypeEnum';

@Entity({ name: 'companies' })
export class CompanyEntity {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ unique: true })
	public cuit: string;

	@Column({ type: 'varchar', name: 'name', length: 100 })
	public name: string;

	@Column({
		type: 'text',
	})
	public type: CompanyTypeEnum;

	@CreateDateColumn({ name: 'created_at' })
	public createdAt: Date;

	@Column({ type: 'datetime', name: 'joined_at' })
	@Index()
	public joinedAt: Date;

	@OneToMany(() => TransferEntity, (transfer) => transfer.fromCompany)
	public transfersSent: TransferEntity[];

	@OneToMany(() => TransferEntity, (transfer) => transfer.toCompany)
	public transfersReceived: TransferEntity[];
}
