-- AlterTable: Add Stream architecture fields to notes
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "dropType" TEXT DEFAULT 'text';
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "fileUrl" TEXT;
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "fileName" TEXT;
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "fileType" TEXT;

-- CreateIndex: Add index for dropType queries
CREATE INDEX IF NOT EXISTS "notes_userId_dropType_idx" ON "notes"("userId", "dropType");

-- CreateTable: Boards
CREATE TABLE IF NOT EXISTS "boards" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable: BoardNote junction table
CREATE TABLE IF NOT EXISTS "board_notes" (
    "boardId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "board_notes_pkey" PRIMARY KEY ("boardId", "noteId")
);

-- CreateIndex: Boards indexes
CREATE INDEX IF NOT EXISTS "boards_userId_idx" ON "boards"("userId");
CREATE INDEX IF NOT EXISTS "boards_userId_pinned_updatedAt_idx" ON "boards"("userId", "pinned", "updatedAt");

-- CreateIndex: BoardNote indexes
CREATE INDEX IF NOT EXISTS "board_notes_boardId_idx" ON "board_notes"("boardId");
CREATE INDEX IF NOT EXISTS "board_notes_noteId_idx" ON "board_notes"("noteId");

-- AddForeignKey: Boards to User
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'boards_userId_fkey'
    ) THEN
        ALTER TABLE "boards" ADD CONSTRAINT "boards_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey: BoardNote to Board
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'board_notes_boardId_fkey'
    ) THEN
        ALTER TABLE "board_notes" ADD CONSTRAINT "board_notes_boardId_fkey" 
            FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey: BoardNote to Note
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'board_notes_noteId_fkey'
    ) THEN
        ALTER TABLE "board_notes" ADD CONSTRAINT "board_notes_noteId_fkey" 
            FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

