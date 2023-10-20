using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Collections.Generic;
using System.Web.Configuration;

namespace AppCode.Dao
{
    /// <summary>
    /// Executa e faz a comunicação com o banco
    /// </summary>
    public class BaseDAO
    {
        // Objeto de Conexão com o banco de dados
        public SqlConnection Conn = null;

        // Comando para utilizacao por quem herdar
        public SqlCommand Cmmd = null;

        public List<string> ListaProcedures = null;

        public string procedure = null;



        public BaseDAO()
        {
            SetConn();
        }

        /// <summary>
        /// Construtor do Comando
        /// </summary>
        public void NovoCmmd(string NomeProcedure)
        {
            ProceduresParaUserResetSenha();

            if (ListaProcedures.Contains(NomeProcedure))
            {
                string stringConexao = System.Configuration.ConfigurationManager.ConnectionStrings["ConexaoSqlUserResetSenha"].ConnectionString;

                // cria uma nova conexão
                Conn = new SqlConnection(stringConexao);
            }

            if (!string.IsNullOrEmpty(NomeProcedure) && NomeProcedure.IndexOf("dbo.") != 0)
                NomeProcedure = "dbo." + NomeProcedure;

            Cmmd = new SqlCommand(NomeProcedure, Conn)
            {
                CommandType = CommandType.StoredProcedure,
                CommandTimeout = 60
            };
        }

        public void SetProcedureName(string NomeProcedure) 
        {
            procedure = NomeProcedure;
        }

        private void ProceduresParaUserResetSenha() 
        {
            ListaProcedures = new List<string>
            {
                "stp_Sys_TrocarSenha_Upd",
                "stp_Sys_FechaSessao",
                "stp_Sys_ResetarSenha_Upd"
            };
        }

        private void SetConn()
        {
            // Montar a string de conexão com os dados do operador da sessão
            string stringConexao;

            if (HttpContext.Current.Session["op"] != null
                && HttpContext.Current.Session["senha"] != null
                && !string.IsNullOrEmpty(HttpContext.Current.Session["op"].ToString())
                && !string.IsNullOrEmpty(HttpContext.Current.Session["senha"].ToString()))
            {
                stringConexao = System.Configuration.ConfigurationManager.ConnectionStrings["ConexaoSql"].ConnectionString;
                stringConexao = stringConexao.Replace("${UID}", HttpContext.Current.Session["op"].ToString());
                stringConexao = stringConexao.Replace("${PWD}", HttpContext.Current.Session["senha"].ToString());
            }
            else
            {
                stringConexao = System.Configuration.ConfigurationManager.ConnectionStrings["ConexaoSqlUserResetSenha"].ConnectionString;
            }

            // cria uma nova conexão
            Conn = new SqlConnection(stringConexao);
        }

        /// <summary>
        /// Abre a conexão com banco
        /// </summary>
        public void AbreConexao()
        {
            if (Conn.State == ConnectionState.Closed)
            {
                Conn.Open();
            }
        }

        /// <summary>
        /// Fecha a conexão
        /// </summary>
        public void FechaConexao()
        {
            if (Conn.State == ConnectionState.Open)
            {
                Conn.Close();
            }
        }

        /// <summary>
        /// Descartar comando
        /// </summary>
        public void DescartaComando()
        {
            Cmmd.Dispose();
        }

        /// <summary>
        /// Descartar comando
        /// </summary>
        public void DescartaConexao()
        {
            Conn.Dispose();
        }
    }
}