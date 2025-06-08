using Fretefy.Test.Domain.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fretefy.Test.Domain.Interfaces.Services
{
    public interface IRegiaoService
    {
        Task<IEnumerable<RegiaoDto>> ListarRegioesAsync();
        Task<RegiaoDto> ObterRegiaoPorIdAsync(Guid id);
        Task<RegiaoDto> CriarRegiaoAsync(CreateRegiaoDto dto);
        Task AtualizarRegiaoAsync(Guid id, UpdateRegiaoDto dto);
    }
}