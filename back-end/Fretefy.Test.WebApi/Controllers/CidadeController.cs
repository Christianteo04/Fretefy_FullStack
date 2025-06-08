using Fretefy.Test.Domain.Entities;
using Fretefy.Test.Domain.Interfaces;
using Fretefy.Test.Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fretefy.Test.WebApi.Controllers
{
    [Route("api/cidade")]
    [ApiController]
    public class CidadeController : ControllerBase
    {
        private readonly ICidadeService _cidadeService;

        public CidadeController(ICidadeService cidadeService)
        {
            _cidadeService = cidadeService;
        }

        [HttpGet]
        public async Task<IActionResult> ListAsync([FromQuery] string uf, [FromQuery] string terms)
        {
            IEnumerable<Cidade> cidades;

            if (!string.IsNullOrEmpty(terms))
                cidades = await _cidadeService.QueryAsync(terms);
            else if (!string.IsNullOrEmpty(uf))
                cidades = await _cidadeService.ListByUfAsync(uf);
            else
                cidades = await _cidadeService.ListAsync();

            return Ok(cidades);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var cidades = await _cidadeService.GetByIdAsync(id);
            return Ok(cidades);
        }
    }
}
