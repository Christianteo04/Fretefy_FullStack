using System;
using System.Collections.Generic;

namespace Fretefy.Test.Domain.DTOs
{
    public class RegiaoDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public bool Ativo { get; set; }

        public ICollection<CidadeDto> Cidades { get; set; }
    }
}