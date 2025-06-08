using ClosedXML.Excel;
using Fretefy.Test.Domain.DTOs;
using Fretefy.Test.Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Fretefy.Test.WebApi.Controllers 
{
    [ApiController]
    [Route("api/[controller]")] 
    public class RegiaoController : ControllerBase
    {
        private readonly IRegiaoService _regiaoService;

        public RegiaoController(IRegiaoService regiaoService)
        {
            _regiaoService = regiaoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RegiaoDto>>> Listar()
        {
            var regioes = await _regiaoService.ListarRegioesAsync();
            return Ok(regioes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RegiaoDto>> ObterPorId(Guid id)
        {
            try
            {
                var regiao = await _regiaoService.ObterRegiaoPorIdAsync(id);
                return Ok(regiao);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<RegiaoDto>> Criar([FromBody] CreateRegiaoDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var novaRegiao = await _regiaoService.CriarRegiaoAsync(dto);
                return CreatedAtAction(nameof(ObterPorId), new { id = novaRegiao.Id }, novaRegiao);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(Guid id, [FromBody] UpdateRegiaoDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _regiaoService.AtualizarRegiaoAsync(id, dto);

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("export")]
        public async Task<IActionResult> Exportar()
        {

            var regioes = await _regiaoService.ListarRegioesAsync();
            if (!regioes.Any())
                return NotFound("Nenhuma região encontrada para exportação.");

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Regiões");
                worksheet.Cell(1, 1).Value = "Região";
                worksheet.Cell(1, 2).Value = "Cidades";
                worksheet.Cell(1, 3).Value = "Status";

                var headerRow = worksheet.Row(1);
                headerRow.Style.Font.Bold = true;

                int currentRow = 2;
                foreach (var regiao in regioes)
                {
                    worksheet.Cell(currentRow, 1).Value = regiao.Nome;
                    worksheet.Cell(currentRow, 2).Value = string.Join(", ", regiao.Cidades.Select(c => $"{c.Nome} ({c.UF})"));
                    worksheet.Cell(currentRow, 3).Value = regiao.Ativo ? "Ativa" : "Inativa";
                    currentRow++;
                }

                worksheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Regioes_{DateTime.Now:yyyyMMdd}.xlsx");
                }
            }
        }
    }
}