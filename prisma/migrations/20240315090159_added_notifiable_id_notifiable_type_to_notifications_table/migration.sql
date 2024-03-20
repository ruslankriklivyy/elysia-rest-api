/*
  Warnings:

  - You are about to drop the column `notification_type` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `notifiable_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notifiable_type` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotifiableType" AS ENUM ('NEW_CHAT', 'NEW_MESSAGE', 'NEW_TASK', 'REMOVE_TASK');

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "notification_type",
ADD COLUMN     "notifiable_id" INTEGER NOT NULL,
ADD COLUMN     "notifiable_type" "NotifiableType" NOT NULL;

-- DropEnum
DROP TYPE "NotificationType";
