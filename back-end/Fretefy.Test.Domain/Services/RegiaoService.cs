using Fretefy.Test.Domain.DTOs;
using Fretefy.Test.Domain.Entities;
using Fretefy.Test.Domain.Interfaces.Repositories;
using Fretefy.Test.Domain.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fretefy.Test.Domain.Services
{
    public class RegiaoService : IRegiaoService
    {
        private readonly IRegiaoRepository _regiaoRepository;
        private readonly ICidadeRepository _cidadeRepository;

        public RegiaoService(IRegiaoRepository regiaoRepository, ICidadeRepository cidadeRepository)
        {
            _regiaoRepository = regiaoRepository;
            _cidadeRepository = cidadeRepository;
        }

        public async Task<IEnumerable<RegiaoDto>> ListarRegioesAsync()
        {
            var regioes = await _regiaoRepository.ListarComCidadesAsync();
            if (regioes == null || !regioes.Any())
                return Enumerable.Empty<RegiaoDto>();

            return regioes.Select(regiao => new RegiaoDto
            {
                Id = regiao.Id,
                Nome = regiao.Nome,
                Ativo = regiao.Ativo,
                Cidades = regiao.RegiaoCidades.Select(rc => new CidadeDto
                {
                    Id = rc.Cidade.Id,
                    Nome = rc.Cidade.Nome,
                    UF = rc.Cidade.UF
                }).ToList()
            });
        }

        public async Task<RegiaoDto> ObterRegiaoPorIdAsync(Guid id)
        {
            var regiao = await _regiaoRepository.ObterPorIdComCidadesAsync(id);
            if (regiao == null)
                throw new KeyNotFoundException("Região não encontrada.");

            return new RegiaoDto
            {
                Id = regiao.Id,
                Nome = regiao.Nome,
                Cidades = regiao.RegiaoCidades.Select(rc => new CidadeDto
                {
                    Id = rc.Cidade.Id,
                    Nome = rc.Cidade.Nome,
                    UF = rc.Cidade.UF
                }).ToList()
            };
        }

        public async Task<RegiaoDto> CriarRegiaoAsync(CreateRegiaoDto dto)
        {
            if (await _regiaoRepository.NomeJaExiste(dto.Nome))
            {
                throw new Exception($"Já existe uma região com o nome '{dto.Nome}'.");
            }

            var regiao = new Regiao { Nome = dto.Nome, Ativo = dto.Ativo };

            if (dto.CidadeIds != null && dto.CidadeIds.Any())
            {
                var cidadesExistentes = await _cidadeRepository.ListByIdsAsync(dto.CidadeIds);
                if (cidadesExistentes.Count() != dto.CidadeIds.Count)
                {
                    throw new KeyNotFoundException("Uma ou mais cidades fornecidas não foram encontradas.");
                }

                foreach (var cidadeId in dto.CidadeIds)
                {
                    regiao.RegiaoCidades.Add(new RegiaoCidade { CidadeId = cidadeId });
                }
            }

            await _regiaoRepository.AdicionarAsync(regiao);

            return await ObterRegiaoPorIdAsync(regiao.Id);
        }

        public async Task AtualizarRegiaoAsync(Guid id, UpdateRegiaoDto dto)
        {
            var regiaoExistente = await _regiaoRepository.ObterPorIdComCidadesAsync(id);
            if (regiaoExistente == null)
            {
                throw new KeyNotFoundException("Região não encontrada para atualização.");
            }

            if (await _regiaoRepository.NomeJaExiste(dto.Nome, id))
            {
                throw new Exception($"Já existe uma região com o nome '{dto.Nome}'.");
            }

            regiaoExistente.Nome = dto.Nome;
            regiaoExistente.Ativo = dto.Ativo;

            var idsCidadesAtuais = regiaoExistente.RegiaoCidades.Select(rc => rc.CidadeId).ToHashSet();
            var idsCidadesNovas = dto.CidadeIds.ToHashSet();

            var ligacoesParaRemover = regiaoExistente.RegiaoCidades
                .Where(rc => !idsCidadesNovas.Contains(rc.CidadeId)).ToList();

            foreach (var ligacao in ligacoesParaRemover) 
                regiaoExistente.RegiaoCidades.Remove(ligacao);

            var idsParaAdicionar = idsCidadesNovas.Except(idsCidadesAtuais).ToList();
            if (idsParaAdicionar.Any())
            {
                var cidadesParaAdicionar = await _cidadeRepository.ListByIdsAsync(idsParaAdicionar);
                if (cidadesParaAdicionar.Count() != idsParaAdicionar.Count)
                {
                    throw new KeyNotFoundException("Uma ou mais cidades fornecidas para adição não foram encontradas.");
                }
                foreach (var cidadeId in idsParaAdicionar)
                {
                    regiaoExistente.RegiaoCidades.Add(new RegiaoCidade { CidadeId = cidadeId });
                }
            }

            await _regiaoRepository.AtualizarAsync(regiaoExistente);
        }
    }
}