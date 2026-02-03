import { plainToInstance } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString, validateSync, IsOptional, IsUrl } from 'class-validator';

class EnvironmentVariables {
    @IsUrl({ require_tld: false })
    BACKEND_URL: string;

    @IsString()
    WORKER_TOKEN: string;

    @IsBoolean()
    @IsOptional()
    HEADLESS: boolean = true;
}

export function validate(config: Record<string, any>) {
    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config,
        { enableImplicitConversion: true },
    );
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        const errorMessages = errors.map(err => Object.values(err.constraints || {}).join(', ')).join('; ');
        throw new Error(`Config validation error: ${errorMessages}`);
    }
    return validatedConfig;
}
