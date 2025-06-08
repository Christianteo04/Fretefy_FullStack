using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Fretefy.Test.Domain.DTOs
{
    public class UpdateRegiaoDto
    {
        [Required]
        [MaxLength(100)]
        public string Nome { get; set; }

        [Required]
        public bool Ativo { get; set; }

        public ICollection<Guid> CidadeIds { get; set; } = new List<Guid>();
    }
}