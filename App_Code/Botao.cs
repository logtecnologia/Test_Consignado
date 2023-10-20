using AppCode.Dao;
using System.Collections.Generic;

namespace AppCode
{
    public class Botao
    {
        public string CodigoAcao { get; set; }
        public string CaptionSistema { get; set; }
        public string CaptionModulo { get; set; }
        public string CaptionPagina { get; set; }
        public string CaptionAcao { get; set; }
        public string Mensagem { get; set; }
    }

    public class BotaoDao
    {
        public List<Botao> GetAll(string sistema, string modulo, string pagina)
        {
            Identificacao identificacao = new Identificacao();

            if (sistema == null)
            {
                sistema = identificacao.Sistema;
            }

            if (modulo == null)
            {
                modulo = identificacao.Modulo;
            }

            return Get(identificacao.Usuario, sistema, modulo, pagina);
        }

        public List<Botao> GetAll()
        {
            Identificacao identificacao = new Identificacao();

            return Get(identificacao.Usuario, identificacao.Sistema, identificacao.Modulo, identificacao.Pagina);
        }

        private List<Botao> Get(string cpf, string sistema, string modulo, string pagina)
        {
            try
            {
                Dictionary<string, object> parametros = new Dictionary<string, object>()
                {
                    {"@Acao", "C_ACAO"},
                    {"@DocPrincipal", cpf},
                    {"@Sistema", sistema},
                    {"@Modulo", modulo},
                    {"@Pagina", pagina}
                };

                return new ManutencaoDAO().ExecutarProcedureList<Botao>("stp_sys_MontaMenu", parametros);
            }
            catch
            {
                return new List<Botao>();
            }
        }
    }
}