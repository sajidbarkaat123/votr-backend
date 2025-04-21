# Prisma Migration Guide

This guide outlines how to safely manage database schema changes with Prisma in different environments.

## Development Workflow

When making schema changes in development:

1. Update your `prisma/schema.prisma` file with the new schema
2. Generate and apply a migration:
   ```bash
   npm run prisma:migrate:dev -- --name descriptive_name_of_changes
   ```
   This will:
   - Create a new migration file in `prisma/migrations`
   - Apply the migration to your development database
   - Generate the Prisma Client

3. If you need to reset your development database:
   ```bash
   npm run db:reset
   ```
   ⚠️ **WARNING**: This will delete all data in your development database. NEVER use in production!

4. To explore your database visually:
   ```bash
   npm run prisma:studio
   ```

## Production Workflow

For deploying schema changes to production:

1. **NEVER** use `db:reset` or `prisma migrate dev` in production
2. **ALWAYS** use the deploy command:
   ```bash
   npm run prisma:migrate:prod
   ```
   This safely applies pending migrations without dropping data.

3. Before deploying to production, always test your migrations on a staging environment.

## Handling Schema Drift

If your production database schema has drifted from your Prisma schema (e.g., manual changes were made to the database):

1. Use `prisma migrate diff` to identify differences:
   ```bash
   npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-database-url DATABASE_URL
   ```

2. You may need to create a new migration that aligns your database with your schema without dropping data.

## Seeding Data

To seed your development database:
```bash
npm run prisma:seed
```

⚠️ Be cautious when seeding production databases. Only seed initial, essential data in production.

## Best Practices

1. **Small, Incremental Changes**: Make small schema changes in each migration
2. **Descriptive Names**: Use descriptive migration names (e.g., `add_user_profile_fields`)
3. **Version Control**: Always commit migration files to version control
4. **Test Migrations**: Test migrations on copies of production data before deploying
5. **Backup**: Always backup your production database before applying migrations

## Troubleshooting

If you encounter the warning about dropping the database:

- In development: This is normal and safe to accept
- In production: STOP and use `prisma migrate deploy` instead

Remember: The goal in production is to apply only the necessary changes while preserving existing data. 