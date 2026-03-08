using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Fretefy.Test.Domain.DTOs
{
    public class CreateRegiaoDto
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; }

        [Required]
        public bool Ativo { get; set; }

        [MinLength(1, ErrorMessage = "É obrigatório informar ao menos uma cidade.")]
        public ICollection<Guid> CidadeIds { get; set; } = new List<Guid>();
    }
}
