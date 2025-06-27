
## Description
API developed with NestJS to manage companies and their transfers. It includes Swagger documentation, a relational database (SQLite for this local implementation), automated testing, and a decoupled design based on Hexagonal Architecture principles.


<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg" height="40" alt="nestjs logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" height="40" alt="jest logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" height="40" alt="sqlite logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" height="40" alt="eslint logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=aws" height="40" alt="amazonwebservices logo"  />
</div>

## Requirements
- Node.js version 22.0.0 or higher


## Instructions to run the project

### Project setup

```bash
$ npm install
```

### Seed the Database

To populate the database with demo data (companies and transfers), a development-only seed endpoint is available.

> This endpoint only works when `NODE_ENV=development`.

### Steps

1. Make sure the project is running in development mode:

```bash
$ npm run start:dev
```
2. Send a POST request to the following endpoint (with a empty body):
```bash
POST http://localhost:3000/seed
```

Now you can test the project

## Swagger docs
The Swagger UI is available at:
http://localhost:3000/api/docs



## Run tests

```bash
# unit tests
$ npm run test
```

## Desiciones técnicas
- Decidí crear joined_at y created_at en la tabla companies porque considero que puede existir la situación en la que se quieran registrar empresas con fechas anteriores de adhesión (por ejemplo por migración) 
- Decidí crear created_at y transfered_at en la tabla transfer porque considero que la transferencia puede ocurrir en un momento distinto a la creación del registro. Si es siempre la misma podríamos no utilizar created_at 
- Utilice uuids en los campos de id para que si el sistema fuera distribuido en un futuro no colisionen los id
- Cree un índice para transferredAt en la tabla transfers optimizar las consultas de las empresas que realizaron transferencias el ultimo mes 
- Cree un índice para joinedAt en la tabla companies para optimizar las consultas para obtener las empresas que se adhirieron en el ultimo mes
- Integré Swagger para documentar todos los endpoints de la API (no estaba en las consignas)
- En cuanto a los tests, como la consigna decia unitarios realice tests de los casos de uso y del controller. El controller no suelo testearlo porque suelo realizar al menos un test e2e del happy path que ya cubre la integracion del controller con los casos de uso y valida que funcione de punta a punta. 

# Lamda challenge

### Código de Lambda

```ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

enum CompanyTypeEnum {
  PYME = 'pyme',
  CORPORATE = 'corporate',
}

interface CompanyInput {
  cuit: string;
  name: string;
  type: CompanyTypeEnum;
}

interface CompanyResponse {
  id: string;
  cuit: string;
  name: string;
  type: CompanyTypeEnum;
}

const validateInput = (data: any): string | null => {
  if (!data.cuit || typeof data.cuit !== 'string') {
    return 'CUIT is required and must be a string';
  }
  if (!/^\d{11}$/.test(data.cuit)) {
    return 'CUIT must be exactly 11 digits with no dashes';
  }

  if (!data.name || typeof data.name !== 'string') {
    return 'Name is required and must be a string';
  }

  if (!data.type || typeof data.type !== 'string') {
    return 'Type is required and must be a string';
  }
  if (!Object.values(CompanyTypeEnum).includes(data.type)) {
    return `Type must be a valid Company Type: ${Object.values(CompanyTypeEnum).join(', ')}`;
  }

  return null;
};

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing request body' }),
    };
  }

  let data: CompanyInput;
  try {
    data = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON' }),
    };
  }

  const errorMessage = validateInput(data);
  if (errorMessage) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: errorMessage }),
    };
  }

  const client = new Client({
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT || 5432),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  });

  try {
    await client.connect();

    const id = uuidv4();

    const query = `
      INSERT INTO companies (id, cuit, name, type)
      VALUES ($1, $2, $3, $4)
      RETURNING id, cuit, name, type
    `;

    const values = [id, data.cuit, data.name, data.type];

    const res = await client.query(query, values);

    await client.end();

    const insertedCompany: CompanyResponse = res.rows[0];

    return {
      statusCode: 201,
      body: JSON.stringify(insertedCompany),
    };
  } catch (error) {
    console.error('DB Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Database error' }),
    };
  }
};

```

### Input

```json
{
  "cuit": "20123456789",
  "name": "Empresa Test",
  "type": "pyme"
}
```

### Output

```json
{
  "id": "4f721a1b-4cc2-4468-9f45-9ab7be9cb38d",
  "cuit": "20123456789",
  "name": "Empresa Test",
  "type": "pyme"
}
```

### Breve explicación de cómo la integrarías con el sistema

Antes que nada lo que haría seria  implementar la base de datos en RDS o DynamoDB en la que ejecutaria las migraciones de la API creada anteriormente. Como en este caso los adaptadores estan hechos para SQLite tendria que cambiar el tipo de base de datos y hacer adaptadores para la base de datos que corresponda (lo que no seria complicado por la arquitectura desacoplada del proyecto). 

Implementaría la funcionalidad de adherir empresa por fuera de la API, creando un lamda function que realice la misma logica de validacion que realice en la API y que si es valida inserte el registro en la tabla de companies. 

Ademas haria que el trigger que lo dispara sea una llamada http mediante que entre por API Gateway.


