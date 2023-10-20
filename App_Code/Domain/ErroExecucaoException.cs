using System;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Web.Helpers;

namespace AppCode.Domain
{
    /// <summary>
    /// Summary description for ErroExecucaoException
    /// </summary>
    public class ErroExecucaoException : Exception
    {
        public List<dynamic> ListaErro;

        public ErroExecucaoException(List<SqlError> _ListaErro)
        {
            ListaErro = new List<dynamic>();

            foreach (SqlError item in _ListaErro)
            {
                // converte SqlError para json
                string json = SqlErrorToJson(item);

                // verifica se o erro foi convertido para json
                if (json != null)
                {
                    /*
                     * decodifica de json para objeto
                     * Formato do objeto
                     * {
                     *    TipoMensagem: <V = Validação, F = Formulário>,
                     *    NomeInput: <Nome do input, ou null em caso de mensagem de validação>
                     *    Mensagem: <Mensagem>
                     * }
                     */
                    dynamic erro = Json.Decode(json);

                    // adiciona o objeto na lista
                    ListaErro.Add(erro);
                }
            }
        }

        private string SqlErrorToJson(SqlError error)
        {
            // 3609 = The transaction ended in the trigger. The batch has been aborted.
            if (error.Number == 3609) return null;

            // O erro 50001 já vem no formato json, só precisa retornar
            if (error.Number == 50001) return error.Message;

            // Um erro diferente dos tratados acima precisa ser convertido em json
            // Esse erro é de validação {TipoMensagem: "V", NomeInput: "", Mensagem: "<Mensagem>"}
            return "{\"TipoMensagem\":\"V\",\"NomeInput\":\"\",\"Mensagem\":\"" + error.Message + "\"}";
        }
    }
}