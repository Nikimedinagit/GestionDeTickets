using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionTickets.API.Migrations
{
    /// <inheritdoc />
    public partial class RelacionUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UsuarioFinalizadorId",
                table: "Ticket",
                newName: "UsuarioFinalizadorID");

            migrationBuilder.AlterColumn<string>(
                name: "UsuarioFinalizadorID",
                table: "Ticket",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_UsuarioFinalizadorID",
                table: "Ticket",
                column: "UsuarioFinalizadorID");

            migrationBuilder.AddForeignKey(
                name: "FK_Ticket_AspNetUsers_UsuarioFinalizadorID",
                table: "Ticket",
                column: "UsuarioFinalizadorID",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ticket_AspNetUsers_UsuarioFinalizadorID",
                table: "Ticket");

            migrationBuilder.DropIndex(
                name: "IX_Ticket_UsuarioFinalizadorID",
                table: "Ticket");

            migrationBuilder.RenameColumn(
                name: "UsuarioFinalizadorID",
                table: "Ticket",
                newName: "UsuarioFinalizadorId");

            migrationBuilder.AlterColumn<string>(
                name: "UsuarioFinalizadorId",
                table: "Ticket",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
