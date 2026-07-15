import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ParentsService } from './services/parents.service';
import {
  CreateParentDto,
  UpdateParentDto,
  QueryParentDto,
  UpdateVerificationStatusDto,
} from './dto';
import {
  PaginatedParentsResponseDto,
  ParentProfileDto,
  ParentDashboardDto,
  KYCStatusDto,
  VerificationQueueResponseDto,
} from './dto/parent-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Parents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  @Roles(Role.PARENT, Role.ADMIN)
  @ApiOperation({ summary: 'Create parent profile' })
  @ApiResponse({ status: 201, description: 'Parent profile created successfully' })
  @ApiResponse({ status: 400, description: 'Parent profile already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateParentDto })
  create(
    @CurrentUser('sub') userId: string,
    @Body() createParentDto: CreateParentDto,
  ) {
    return this.parentsService.create(userId, createParentDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.ORPHANAGE)
  @ApiOperation({ summary: 'Get all parents with filters and pagination' })
  @ApiResponse({ status: 200, type: PaginatedParentsResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(
    @Query() queryDto: QueryParentDto,
    @CurrentUser('role') userRole: Role,
    @CurrentUser('sub') userId: string,
  ) {
    return this.parentsService.findAll(queryDto, userRole, userId);
  }

  @Get('dashboard')
  @Roles(Role.PARENT)
  @ApiOperation({ summary: 'Get parent dashboard data' })
  @ApiResponse({ status: 200, type: ParentDashboardDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Parent profile not found' })
  getDashboard(@CurrentUser('sub') userId: string) {
    return this.parentsService.getDashboard(userId);
  }

  @Get('kyc')
  @Roles(Role.PARENT)
  @ApiOperation({ summary: 'Get KYC status and compliance' })
  @ApiResponse({ status: 200, type: KYCStatusDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Parent profile not found' })
  getKycStatus(@CurrentUser('sub') userId: string) {
    return this.parentsService.getKycStatus(userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.ORPHANAGE, Role.PARENT)
  @ApiOperation({ summary: 'Get parent profile by ID' })
  @ApiResponse({ status: 200, type: ParentProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Parent not found' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.parentsService.findOne(id, userId, userRole);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PARENT)
  @ApiOperation({ summary: 'Update parent profile' })
  @ApiResponse({ status: 200, description: 'Parent profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Parent not found' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateParentDto: UpdateParentDto,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    await this.parentsService.update(id, updateParentDto, userId, userRole);
    return { message: 'Parent profile updated successfully' };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft delete parent profile' })
  @ApiResponse({ status: 200, description: 'Parent profile deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Parent not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.parentsService.remove(id);
    return { message: 'Parent profile deleted successfully' };
  }

  @Patch(':id/verification-status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update parent verification status' })
  @ApiResponse({ status: 200, description: 'Verification status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Parent not found' })
  @HttpCode(HttpStatus.OK)
  async updateVerificationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVerificationStatusDto,
    @CurrentUser('sub') adminId: string,
  ) {
    await this.parentsService.updateVerificationStatus(id, dto, adminId);
    return { message: 'Verification status updated successfully' };
  }

  @Post(':id/approve')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Approve parent application' })
  @ApiResponse({ status: 200, description: 'Parent approved successfully' })
  @ApiResponse({ status: 400, description: 'Parent already approved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Parent not found' })
  @HttpCode(HttpStatus.OK)
  async approve(
    @Param('id') id: string,
    @CurrentUser('sub') adminId: string,
  ) {
    await this.parentsService.approveParent(id, adminId);
    return { message: 'Parent approved successfully' };
  }

  @Post(':id/reject')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Reject parent application' })
  @ApiResponse({ status: 200, description: 'Parent rejected successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Parent not found' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string', example: 'Incomplete documents' },
      },
      required: ['reason'],
    },
  })
  @HttpCode(HttpStatus.OK)
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser('sub') adminId: string,
  ) {
    await this.parentsService.rejectParent(id, reason, adminId);
    return { message: 'Parent rejected successfully' };
  }
}

@ApiTags('Admin - Parent Verification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/parents')
export class AdminParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get('verification/queue')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get parent verification queue' })
  @ApiResponse({ status: 200, type: VerificationQueueResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getVerificationQueue(@Query() queryDto: QueryParentDto) {
    return this.parentsService.getVerificationQueue(queryDto);
  }

  @Get(':id/verification-details')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get full parent verification details' })
  @ApiResponse({ status: 200, type: ParentProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Parent not found' })
  getVerificationDetails(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.parentsService.findOne(id, userId, userRole);
  }
}
