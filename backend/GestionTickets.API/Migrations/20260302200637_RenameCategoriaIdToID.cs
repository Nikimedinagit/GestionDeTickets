using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionTickets.API.Migrations
{
    /// <inheritdoc />
    public partial class RenameCategoriaIdToID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ticket_Categoria_CategoriaId",
                table: "Ticket");

            migrationBuilder.RenameColumn(
                name: "CategoriaId",
                table: "Ticket",
                newName: "CategoriaID");

            migrationBuilder.RenameIndex(
                name: "IX_Ticket_CategoriaId",
                table: "Ticket",
                newName: "IX_Ticket_CategoriaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Ticket_Categoria_CategoriaID",
                table: "Ticket",
                column: "CategoriaID",
                principalTable: "Categoria",
                principalColumn: "CategoriaID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ticket_Categoria_CategoriaID",
                table: "Ticket");

            migrationBuilder.RenameColumn(
                name: "CategoriaID",
                table: "Ticket",
                newName: "CategoriaId");

            migrationBuilder.RenameIndex(
                name: "IX_Ticket_CategoriaID",
                table: "Ticket",
                newName: "IX_Ticket_CategoriaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ticket_Categoria_CategoriaId",
                table: "Ticket",
                column: "CategoriaId",
                principalTable: "Categoria",
                principalColumn: "CategoriaID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
