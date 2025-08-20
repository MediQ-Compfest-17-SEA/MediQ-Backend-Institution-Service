import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institutioin.dto';

@ApiTags('institutions')
@Controller('institutions')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new institution' })
  @ApiResponse({ 
    status: 201, 
    description: 'The institution has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        code: { type: 'string' },
        address: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        type: { type: 'string' },
        status: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateInstitutionDto })
  create(@Body() createInstitutionDto: CreateInstitutionDto) {
    return this.institutionService.create(createInstitutionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all institutions' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all institutions.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          code: { type: 'string' },
          address: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string' },
          type: { type: 'string' },
          status: { type: 'string' }
        }
      }
    }
  })
  findAll() {
    return this.institutionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an institution by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the institution.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        code: { type: 'string' },
        address: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        type: { type: 'string' },
        status: { type: 'string' },
        services: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              description: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Institution not found.' })
  findOne(@Param('id') id: string) {
    return this.institutionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an institution' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateInstitutionDto })
  @ApiResponse({ 
    status: 200, 
    description: 'The institution has been successfully updated.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        code: { type: 'string' },
        address: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        type: { type: 'string' },
        status: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Institution not found.' })
  update(@Param('id') id: string, @Body() updateInstitutionDto: UpdateInstitutionDto) {
    return this.institutionService.update(id, updateInstitutionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an institution' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'The institution has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Institution not found.' })
  remove(@Param('id') id: string) {
    return this.institutionService.remove(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Get services for an institution' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return services for the institution.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Institution not found.' })
  getServices(@Param('id') id: string) {
    return this.institutionService.getServices(id);
  }

  // RabbitMQ Message Patterns
  @MessagePattern('institution.create')
  async handleCreate(@Payload() data: CreateInstitutionDto) {
    return this.institutionService.create(data);
  }

  @MessagePattern('institution.findAll')
  async handleFindAll() {
    return this.institutionService.findAll();
  }

  @MessagePattern('institution.findOne')
  async handleFindOne(@Payload() data: { id: string }) {
    return this.institutionService.findOne(data.id);
  }

  @MessagePattern('institution.update')
  async handleUpdate(@Payload() data: { id: string; updateData: UpdateInstitutionDto }) {
    return this.institutionService.update(data.id, data.updateData);
  }

  @MessagePattern('institution.delete')
  async handleDelete(@Payload() data: { id: string }) {
    return this.institutionService.remove(data.id);
  }

  @MessagePattern('institution.getServices')
  async handleGetServices(@Payload() data: { id: string }) {
    return this.institutionService.getServices(data.id);
  }

  @MessagePattern('health.check')
  async handleHealthCheck() {
    return { status: 'ok', service: 'institution-service', timestamp: new Date().toISOString() };
  }
}