using AppCode.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;


namespace AppCode.Dao
{
    /// <summary>
    /// Monta automaticamente o comando para execucao da stored procedure
    /// </summary>
    public class ManutencaoDAO : BaseDAO
    {
        private string GetAutorizacao(string sistema, string modulo, string pagina, string acao)
        {           
            SqlDataReader dr = null;

            try
            {
                Identificacao identificacao = new Identificacao();

                base.NovoCmmd("stp_Sys_Verifica_Autorizacao");
                Cmmd.Parameters.AddWithValue("@Sistema", sistema ?? identificacao.Sistema);
                Cmmd.Parameters.AddWithValue("@Modulo", modulo ?? identificacao.Modulo);
                Cmmd.Parameters.AddWithValue("@Pagina", pagina ?? identificacao.Pagina);
                Cmmd.Parameters.AddWithValue("@Acao", acao);
                Cmmd.Parameters.AddWithValue("@DocOperador", identificacao.Usuario);
                Cmmd.Parameters.AddWithValue("@idSessao", identificacao.IdSessao);

                base.AbreConexao();

                dr = Cmmd.ExecuteReader();

                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        return dr["NomeProcedure"].ToString();
                    }                   
                }              
            }
            finally
            {
                if (dr != null)
                {
                    dr.Close();
                    dr.Dispose();
                }

                base.DescartaComando();
            }

            return null;
        }

        public bool VerificaAutorizacao(string acao)
        {
            string procedure = GetAutorizacao(null, null, null, acao);
            return !procedure.IsNullOrEmpty();
        }

        public bool VerificaAutorizacao(string sistema, string modulo, string pagina, string acao)
        {           
            string procedure = GetAutorizacao(sistema, modulo, pagina, acao);
            return !procedure.IsNullOrEmpty();
        }

        public void ExecutarAcao(string acao, Dictionary<string, object> parametros)
        {           
            string procedure = GetNomeProcedure(acao);
            Executar(procedure, parametros);
        }

        public void ExecutarAcao(string sistema, string modulo, string pagina, string acao, Dictionary<string, object> parametros)
        {
            string procedure = GetNomeProcedure(sistema, modulo, pagina, acao);                     
            Executar(procedure, parametros);
        }

        //Executa uma procedure sem retorno
        public void ExecutarProcedure(string procedure, Dictionary<string, object> parametros)
        {
            Executar(procedure, parametros);
        }

        //Efetua uma consulta retornando um DataSet
        public DataSet ExecutarAcaoDS(string acao, Dictionary<string, object> parametros)
        {
            string procedure = GetNomeProcedure(acao);
          
            return ExecutarDS(procedure, parametros);
        }

        public DataSet ExecutarAcaoDS(string sistema, string modulo, string pagina, string acao, Dictionary<string, object> parametros)
        {
            string procedure = GetNomeProcedure(sistema, modulo, pagina, acao);
         
            return ExecutarDS(procedure, parametros);
        }

        //Efetua uma consulta retornando um DataSet
        public DataSet ExecutarProcedureDS(string procedure, Dictionary<string, object> parametros)
        {
            return ExecutarDS(procedure, parametros);
        }

        //Efetua uma consulta retornando um DataTable
        public DataTable ExecutarAcaoDT(string acao, Dictionary<string, object> parametros)
        {
            string procedure = GetNomeProcedure(acao);
            return ExecutarDT(procedure, parametros);
        }

        //Efetua uma consulta retornando um DataTable
        public DataTable ExecutarAcaoDT(string sistema, string modulo, string pagina, string acao, Dictionary<string, object> parametros)
        {
            string procedure = GetNomeProcedure(sistema, modulo, pagina, acao);
            return ExecutarDT(procedure, parametros);
        }

        //Efetua uma consulta retornando um DataTable
        public DataTable ExecutarProcedureDT(string procedure, Dictionary<string, object> parametros)
        {
            return ExecutarDT(procedure, parametros);
        }

        /// <summary>
        /// Retorna o nome da procedure referente à ação
        /// </summary>
        private string GetNomeProcedure(string acao)
        {
            string procedure = GetAutorizacao(null, null, null, acao);

            if (procedure.IsNullOrEmpty())
            {
                throw new Exception("Usuário não está autorizado para executar esta ação.");
            }

            return procedure;
        }

        private string GetNomeProcedure(string sistema, string modulo, string pagina, string acao)
        {
            string procedure = GetAutorizacao(sistema, modulo, pagina, acao);

            if (procedure.IsNullOrEmpty())
            {
                throw new Exception("Usuário não está autorizado para executar esta ação.");
            }

            return procedure;
        }

        private void Executar(string procedure, Dictionary<string, object> parametros)
        {
            //Lista usada para gerenciar os erros de execução
            List<SqlError> erros = null;

            try
            {
                // cria um novo comando
                base.NovoCmmd(procedure);

                //seta a configuração para disparar um evento, quando acontecer um erro de baixa relevância na procedure
                base.Conn.FireInfoMessageEventOnUserErrors = true;

                //função lambda para tratar cada erro disparado pela procedure
                base.Conn.InfoMessage += new SqlInfoMessageEventHandler((object sender, SqlInfoMessageEventArgs e) =>
                {
                    //se a lista não estiver instanciada
                    if (erros == null)
                    {
                        //instância uma nova lista
                        erros = new List<SqlError>();
                    }

                    foreach (SqlError error in e.Errors)
                    {
                        // adiciona os erros na lista
                        erros.Add(error);
                    }
                });

                Dictionary<string, string> values = new Dictionary<string, string>();

                foreach (KeyValuePair<string, object> p in parametros)
                {
                    Cmmd.Parameters.AddWithValue(p.Key, p.Value);
                }

                base.AbreConexao();

                Cmmd.ExecuteNonQuery();

                // verifica se aconteceu algum erro
                if (erros != null)
                {
                    throw new ErroExecucaoException(erros);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                base.DescartaComando();
                base.FechaConexao();
                base.DescartaConexao();
            }
        }

        private DataTable ExecutarDT(string procedure, Dictionary<string, object> parametros)
        {
            DataTable dt = null;
            SqlDataReader dr = null;

            try
            {
                base.NovoCmmd(procedure);

                foreach (KeyValuePair<string, object> p in parametros)
                {
                    Cmmd.Parameters.AddWithValue(p.Key, p.Value);
                }

                base.AbreConexao();

                dr = Cmmd.ExecuteReader();

                dt = new DataTable();
                dt.BeginLoadData();
                dt.Load(dr);
                dt.EndLoadData();
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            finally
            {
                if (dr != null)
                {
                    dr.Close();
                    dr.Dispose();
                }

                base.DescartaComando();
                base.FechaConexao();
            }

            return dt;
        }

        private DataSet ExecutarDS(string procedure, Dictionary<string, object> parametros)
        {
            SqlDataAdapter da = null;
            DataSet ds = null;

            try
            {
                base.NovoCmmd(procedure);

                foreach (KeyValuePair<string, object> p in parametros)
                {
                    Cmmd.Parameters.AddWithValue(p.Key, p.Value);
                }

                base.AbreConexao();
                da = new SqlDataAdapter(Cmmd);
                ds = new DataSet();
                da.Fill(ds);
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            finally
            {
                if (da != null)
                {
                    da.Dispose();
                }

                base.DescartaComando();
                base.FechaConexao();
                base.DescartaConexao();
            }

            return ds;
        }

        public T ExecutarAcao<T>(string acao, Dictionary<string, object> parametros)
        {
            return ExecutarAcaoList<T>(acao, parametros).FirstOrDefault();
        }

        public List<T> ExecutarAcaoList<T>(string acao, Dictionary<string, object> parametros)
        {
            string procedure = GetNomeProcedure(acao);
            return GetLista<T>(procedure, parametros);
        }

        public T ExecutarAcao<T>(string sistema, string modulo, string pagina, string acao, Dictionary<string, object> parametros)
        {
            return ExecutarAcaoList<T>(sistema, modulo, pagina, acao, parametros).FirstOrDefault();
        }

        public List<T> ExecutarAcaoList<T>(string sistema, string modulo, string pagina, string acao, Dictionary<string, object> parametros)
        {
            string procedure = GetNomeProcedure(sistema, modulo, pagina, acao);
            return GetLista<T>(procedure, parametros);
        }

        public T ExecutarProcedure<T>(string procedure, Dictionary<string, object> parametros)
        {
            return ExecutarProcedureList<T>(procedure, parametros).FirstOrDefault();
        }

        public List<T> ExecutarProcedureList<T>(string procedure, Dictionary<string, object> parametros)
        {
            return GetLista<T>(procedure, parametros);
        }

        private int GetColumnOrdinal(SqlDataReader dr, string columnName)
        {
            int ordinal = -1;

            for (int i = 0; i < dr.FieldCount; i++)
            {
                if (string.Equals(dr.GetName(i), columnName, StringComparison.OrdinalIgnoreCase))
                {
                    ordinal = i;
                    break;
                }
            }

            return ordinal;
        }

        private List<T> CriaLista<T>(SqlDataReader dr)
        {
            List<T> list = new List<T>();

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    var item = Activator.CreateInstance<T>();
                    foreach (var property in typeof(T).GetProperties())
                    {
                        string nomecoluna;

                        if (property.GetCustomAttribute<ColumnAttribute>() != null)
                        {
                            nomecoluna = property.GetCustomAttribute<ColumnAttribute>().Name;
                        }
                        else
                        {
                            nomecoluna = property.Name;
                        }

                        int i = GetColumnOrdinal(dr, nomecoluna);

                        // se não achar a coluna no datareader, continua o laço
                        if (i < 0) continue;

                        // se for DBNull, continua o laço
                        if (dr[nomecoluna] == DBNull.Value) continue;

                        if (property.PropertyType.IsEnum)
                        {
                            property.SetValue(item, Enum.Parse(property.PropertyType, dr[nomecoluna].ToString()));
                        }
                        else
                        {
                            Type convertTo = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;
                            property.SetValue(item, Convert.ChangeType(dr[nomecoluna], convertTo), null);
                        }
                    }
                    list.Add(item);
                }
            }
            return list;
        }

        private List<T> GetLista<T>(string procedure, Dictionary<string, object> parametros)
        {
            List<T> list = null;
            SqlDataReader dr = null;

            //Lista usada para gerenciar os erros de execução
            List<SqlError> ListaErro = null;

            try
            {
                NovoCmmd(procedure);

                if (parametros != null)
                {
                    foreach (KeyValuePair<string, object> p in parametros)
                    {
                        Cmmd.Parameters.AddWithValue(p.Key, p.Value);
                    }
                }

                //seta a configuração para disparar um evento, quando acontecer um erro de baixa relevância na procedure
                base.Conn.FireInfoMessageEventOnUserErrors = true;

                //função lambda para tratar cada erro disparado pela procedure
                base.Conn.InfoMessage += new SqlInfoMessageEventHandler((object sender, SqlInfoMessageEventArgs e) =>
                {
                    //se a lista não estiver instanciada
                    if (ListaErro == null)
                    {
                        //instância uma nova lista
                        ListaErro = new List<SqlError>();
                    }

                    foreach (SqlError error in e.Errors)
                    {
                        // adiciona os erros na lista
                        ListaErro.Add(error);
                    }
                });

                base.AbreConexao();

                dr = Cmmd.ExecuteReader();

                // verifica se aconteceu algum erro
                if (ListaErro != null)
                {
                    throw new ErroExecucaoException(ListaErro);
                }

                list = CriaLista<T>(dr);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                // Liberar memória DataReader
                if (dr != null)
                {
                    dr.Close();
                    dr.Dispose();
                }

                base.DescartaComando();
                base.FechaConexao();
                base.DescartaConexao();
            }

            return list;
        }
    }
}