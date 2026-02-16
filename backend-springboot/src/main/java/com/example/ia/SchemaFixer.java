package com.example.ia;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Running Smart SchemaFixer...");

        // Fix 1: userId -> user_id
        migrateColumn("userId", "user_id", "BIGINT");

        // Fix 2: createdAt -> created_at
        migrateColumn("createdAt", "created_at", "DATETIME");

        // Fix 3: isRead -> is_read
        migrateColumn("isRead", "is_read", "BIT(1)");

        // Fix 4: updatedAt -> updated_at
        migrateColumn("updatedAt", "updated_at", "DATETIME");
    }

    private void migrateColumn(String oldName, String newName, String typeDef) {
        try {
            // 1. Check if OLD column exists
            boolean oldExists = checkColumnExists(oldName);
            if (!oldExists) {
                System.out.println("Legacy column " + oldName + " not found. Skipping.");
                return;
            }

            System.out.println("Found legacy column " + oldName + ". Migrating to " + newName + "...");

            // 2. Ensure NEW column exists
            if (!checkColumnExists(newName)) {
                System.out.println("Creating new column " + newName + "...");
                jdbcTemplate.execute("ALTER TABLE notifications ADD COLUMN " + newName + " " + typeDef);
            }

            // 3. Copy Data (if old text/value is compatible)
            try {
                System.out.println("Copying data from " + oldName + " to " + newName + "...");
                jdbcTemplate.execute(
                        "UPDATE notifications SET " + newName + " = " + oldName + " WHERE " + newName + " IS NULL");
            } catch (Exception e) {
                System.out.println("Data copy warning: " + e.getMessage());
            }

            // 4. Drop OLD column
            System.out.println("Dropping legacy column " + oldName + "...");
            jdbcTemplate.execute("ALTER TABLE notifications DROP COLUMN " + oldName);
            System.out.println("Success! Fixed " + oldName);

        } catch (Exception e) {
            System.out.println("Migration failed for " + oldName + ": " + e.getMessage());
        }
    }

    private boolean checkColumnExists(String columnName) {
        try {
            // Try to select the column. If it fails, it likely doesn't exist.
            // Or use SHOW COLUMNS LIKE
            java.util.List<String> found = jdbcTemplate.query(
                    "SHOW COLUMNS FROM notifications LIKE '" + columnName + "'",
                    (rs, rowNum) -> rs.getString("Field"));
            return !found.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }
}
