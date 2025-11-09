-- Migration script to update existing users table from name to first_name and last_name
-- Run this if you already have a users table with a 'name' column

-- Step 1: Add new columns if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);

-- Step 2: For existing records, split the name field (if it exists)
-- This assumes you have existing data. Adjust the logic based on your data.
-- If name contains a space, split it; otherwise put everything in first_name
UPDATE users 
SET 
  first_name = CASE 
    WHEN name IS NOT NULL AND name LIKE '% %' THEN 
      SPLIT_PART(name, ' ', 1)
    ELSE 
      COALESCE(name, 'User')
  END,
  last_name = CASE 
    WHEN name IS NOT NULL AND name LIKE '% %' THEN 
      SUBSTRING(name FROM POSITION(' ' IN name) + 1)
    ELSE 
      ''
  END
WHERE first_name IS NULL OR last_name IS NULL;

-- Step 3: Make the columns NOT NULL (after migrating data)
ALTER TABLE users 
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL;

-- Step 4: Drop the old name column (optional - uncomment if you want to remove it)
-- ALTER TABLE users DROP COLUMN IF EXISTS name;

