import { Logger, QueryRunner } from 'typeorm'
import winston from 'winston'

function parametersFormat(parameters: any[]) {
    if (!parameters.length) {
        return ''
    }
    return `\n${parameters.map((parameter) => {
        if (parameter instanceof Date) {
            return `'${parameter.toISOString()}'`
        }
        if (typeof parameter === 'string') {
            return `'${parameter}'`
        }
        return `${parameter}`
    }).join(', ')}`
}

export class CustomLogger implements Logger {
    constructor(private readonly loggerService: winston.Logger) { }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.loggerService.verbose(`Query: ${query}${parametersFormat(parameters)}`)
    }

    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.loggerService.error(`Query Error: ${error}\nQuery: ${query}${parametersFormat(parameters)}`)
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.loggerService.warn(`Slow Query (${time}ms): ${query}${parametersFormat(parameters)}`)
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        this.loggerService.verbose(`Schema Build: ${message}`)
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.loggerService.verbose(`Migration: ${message}`)
    }

    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
        switch (level) {
            case 'log':
                this.loggerService.verbose(message, queryRunner)
                break
            case 'info':
                this.loggerService.info(message, queryRunner)
                break
            case 'warn':
                this.loggerService.warn(message, queryRunner)
                break
            default:
                this.loggerService.verbose(message, queryRunner)
                break
        }
    }
}
