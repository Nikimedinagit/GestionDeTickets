using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionTickets.API.Migrations
{
    /// <inheritdoc />
    public partial class NuevaTablaComentarioReal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ComentarioTicket",
                columns: table => new
                {
                    ComentarioTicketID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TicketID = table.Column<int>(type: "int", nullable: false),
                    UsuarioId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Mensaje = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComentarioTicket", x => x.ComentarioTicketID);
                    table.ForeignKey(
                        name: "FK_ComentarioTicket_Ticket_TicketID",
                        column: x => x.TicketID,
                        principalTable: "Ticket",
                        principalColumn: "TicketID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ComentarioTicket_TicketID",
                table: "ComentarioTicket",
                column: "TicketID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ComentarioTicket");
        }
    }
}
