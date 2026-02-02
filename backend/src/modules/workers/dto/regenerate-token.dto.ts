import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Response DTO for token regeneration endpoint.
 */
export class RegenerateTokenResponseDto {
    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    regeneratedAt: string;
}

/**
 * Response DTO for getting worker token.
 */
export class GetTokenResponseDto {
    @IsNotEmpty()
    token: string;
}
