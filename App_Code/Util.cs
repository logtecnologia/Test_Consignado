using AppCode.Dao;
using AppCode.Domain;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Text.RegularExpressions;
using System.Web.WebPages.Html;
using Aspose.Email;
using Aspose.Email.Clients.Smtp;
using Aspose.Email.Clients;
using System.IO;

namespace AppCode
{
    /// <summary>
    /// Summary description for Util
    /// </summary>
    public class Util
    {
        public static string EnviaEmail(string usuario, string email,string assunto,string mensagem)
        {
            try
            {

                MailMessage mail = new MailMessage()
                {
                    From = new MailAddress("logconsig@outlook.com", "consig log")
                };

                mail.To.Add(new MailAddress(email, usuario));

                mail.Subject = assunto;
                mail.HtmlBody = mensagem;
                //ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(delegate { return true; });

                using var smtp = new SmtpClient("smtp-mail.outlook.com", "logconsig@outlook.com", "Log@1234");
                
                smtp.SecurityOptions = SecurityOptions.SSLAuto;
                smtp.Port = 587; 
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network; 
                smtp.UseDefaultCredentials = false; 

                smtp.Send(mail);
                
                return "OK";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public static string GerarSenha()
        {
            var chars = "abcdefghijklmnopqrstuvwxyz";
            var random = new Random();
            var result = new string(
                Enumerable.Repeat(chars, 3)
                          .Select(s => s[random.Next(s.Length)])
                          .ToArray());

            var chars1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var result1 = new string(
                Enumerable.Repeat(chars1, 2)
                          .Select(s => s[random.Next(s.Length)])
                          .ToArray());

            var chars2 = "1234567890$%&";
            var result2 = new string(
                Enumerable.Repeat(chars2, 3)
                          .Select(s => s[random.Next(s.Length)])
                          .ToArray());

            return result + result1 + result2;
        }

        public static string UFLocal()
        {
            return ConfigurationManager.AppSettings.Get("UFLocal");
        }

        public static string ChecaNulo(string Campo)
        {
            if (string.IsNullOrEmpty(Campo))
            {
                return null;
            }
            else
            {
                return Campo.Trim();
            }
        }

        /* Caracteres para montagem de data e hora
           dd - dia
           MM - M�s
           yyyy - Ano
           HH - Hora
           mm - Minuto
           ss - segundos
           ver refer�ncia da func�o String.Format para outros poss�veis formatos
           */
        public static string FormataData(string qData, string formato)
        {
            DateTime Data;
            string data_str = "";
            string p_formato = "{0:" + formato + "}";

            try
            {
                Data = DateTime.Parse(qData);
                data_str = String.Format(p_formato, Data);
            }
            catch { }
            return data_str;
        }

        /**
        * Recebe um valor e retorna padrao, se nulo ou o proprio valor
        * Sintaxe: x = NaoNulo(Valor, Padrao)
        * Por: S�rgio F�, em 21/08/2003
        **/
        public static string NaoNulo(string Valor, string Padrao)
        {
            if (string.IsNullOrEmpty(Valor))
            {
                return Padrao;
            }
            else
            {
                return Valor;
            }
        }

        public static DataTable LiberarMemoriaDT(ref DataTable dt)
        {
            if (dt != null)
            {
                dt.Clear();
                dt.Dispose();
                dt = null;
            }
            return dt;
        }

        public static DataSet LiberarMemoriaDS(ref DataSet ds)
        {
            if (ds != null)
            {
                ds.Clear();
                ds.Dispose();
                ds = null;
            }
            return ds;
        }

        /**
        * Decodificação de caracteres especiais HTML
        **/
        public static string HtmlDecode(string sText)
        {
            if (sText != null)
            {
                sText = sText.Replace("&quot;", ((char)34).ToString());
                sText = sText.Replace("&lt;", ((char)60).ToString());
                sText = sText.Replace("&gt;", ((char)62).ToString());
                sText = sText.Replace("&amp;", ((char)38).ToString());
                sText = sText.Replace("&nbsp;", ((char)32).ToString());
                sText = sText.Replace("&apos;", ((char)39).ToString());

                for (int i = 1; i <= 255; i++)
                {
                    sText = sText.Replace("&#" + i.ToString() + ";", ((char)i).ToString());
                }
            }

            return sText;
        }


        public static string HtmlEncode(string value)
        {
            if (value != null)
            {
                value = value.Replace("<", "&lt;");
                value = value.Replace(">", "&gt;");
                value = value.Replace("'", "&apos;");
                value = value.Replace(@"""", "&quot;");
            }
            return value;
        }

        public static string Highlight(string input, string keywords)
        {
            if (input == String.Empty || keywords == String.Empty || input == null || keywords == null)
            {
                return input;
            }

            return Regex.Replace(
                input,
                String.Join("|", keywords.Split(' ').Select(x => Regex.Escape(x))),
                string.Format("<mark>{0}</mark>", "$0"),
                RegexOptions.IgnoreCase);
        }

        public static bool IsCpf(string cpf)
        {
            int[] multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            string tempCpf;
            string digito;
            int soma;
            int resto;
            cpf = cpf.Trim();
            cpf = cpf.Replace(".", "").Replace("-", "");
            if (cpf.Length != 11)
                return false;
            tempCpf = cpf.Substring(0, 9);
            soma = 0;

            for (int i = 0; i < 9; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            tempCpf += digito;
            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito += resto.ToString();
            return cpf.EndsWith(digito);
        }

        public static bool IsNumeric(string nome)
        {
            return nome.All(char.IsNumber) ? true : false;
        }
        /**
        * Retorna o CPF/CNPJ formatad
        * Sintaxe: x = FormataCPFCNPJ(numCPFouCNPJ) 
        * Por: Sérgio Fé, em 11/06/2003 
        **/
        public static string FormataCPFCNPJ(string documento)
        {
            string documentoFormatado = documento.Trim();

            if (documentoFormatado.Length == 11)
            {
                documentoFormatado = FormataCPF(documentoFormatado);
            }
            else if (documentoFormatado.Length == 14)
            {
                documentoFormatado = FormataCNPJ(documentoFormatado);
            }

            return documentoFormatado;
        }

        private static string FormataCPF(string str)
        {
            return Convert.ToInt64(str).ToString(@"000\.000\.000\-00");
        }

        private static string FormataCNPJ(string str)
        {
            return Convert.ToInt64(str).ToString(@"00\.000\.000\/0000\-00");
        }

        public static List<T> Sys_EstruturaTabelas<T>(string nomeTabela, string descricao = null, string consultaComposta = null, string consultaComposta2 = null)
        {
            Dictionary<string, object> parametros = new Dictionary<string, object>()
            {
                { "@NomeTabela", nomeTabela },
                { "@Descricao", descricao },
                { "@ConsultaComposta", consultaComposta },
                { "@ConsultaComposta2", consultaComposta2 }
            };

            return new ManutencaoDAO().ExecutarProcedureList<T>("stp_Sys_EstruturaTabelas", parametros);
        }

        public static List<T> Inf_EstruturaTabelas<T>(string nomeTabela, string param01 = null, string param02 = null, string param03 = null, string param04 = null, string param05 = null, string param06 = null, string descricao = null, string consultaComposta = null, string consultaComposta2 = null)
        {
            Dictionary<string, object> parametros = new Dictionary<string, object>()
            {
                { "NomeTabela", nomeTabela },
                { "Param01", param01 },
                { "Param02", param02 },
                { "Param03", param03 },
                { "Param04", param04 },
                { "Param05", param05 },
                { "Param06", param06 },
                { "Descricao", descricao },
                { "ConsultaComposta", consultaComposta },
                { "ConsultaComposta2", consultaComposta2 }
            };

            return new ManutencaoDAO().ExecutarProcedureList<T>("stp_Inf_EstruturaTabelas", parametros);
        }

        public static List<T> Ren_EstruturaTabelas<T>(string nomeTabela, string descricao = null, string consultaComposta = null, string consultaComposta2 = null)
        {
            Dictionary<string, object> parametros = new Dictionary<string, object>()
            {
                { "NomeTabela", nomeTabela },
                { "Descricao", descricao },
                { "ConsultaComposta", consultaComposta },
                { "ConsultaComposta2", consultaComposta2 }
            };

            return new ManutencaoDAO().ExecutarProcedureList<T>("stp_Ren_EstruturaTabelas", parametros);
        }

        public static List<T> Rev_EstruturaTabelas<T>(string nomeTabela, string descricao = null, string consultaComposta = null, string consultaComposta2 = null)
        {
            Dictionary<string, object> parametros = new Dictionary<string, object>()
            {
                { "NomeTabela", nomeTabela },
                { "Descricao", descricao },
                { "ConsultaComposta", consultaComposta },
                { "ConsultaComposta2", consultaComposta2 }
            };

            return new ManutencaoDAO().ExecutarProcedureList<T>("stp_Rev_EstruturaTabelas", parametros);
        }

        public static string RetornaMesExtenso(string Mes)
        {
            if (Mes.Length < 2)
            {
                Mes = "0" + Mes;
            }

            string MesExtenso = Mes switch
            {
                "01" => "Janeiro",
                "02" => "Fevereiro",
                "03" => "Março",
                "04" => "Abril",
                "05" => "Maio",
                "06" => "Junho",
                "07" => "Julho",
                "08" => "Agosto",
                "09" => "Setembro",
                "10" => "Outubro",
                "11" => "Novembro",
                "12" => "Dezembro",
                _ => "",
            };
            return MesExtenso;
        }

        public static void ExceptionHandler(Action action, ModelStateDictionary model)
        {
            try
            {
                action();
            }
            catch (ErroExecucaoException ex)
            {
                if (ex.ListaErro.Any(x => x.TipoMensagem == "F"))
                {
                    model.AddError("alert-warning", "Por favor, verifique o formulário");
                }

                foreach (dynamic item in ex.ListaErro)
                {
                    if (item.TipoMensagem == "F")
                    {
                        model.AddError(item.NomeInput, item.Mensagem);
                    }
                    else if (item.TipoMensagem == "V")
                    {
                        model.AddError("alert-danger", item.Mensagem);
                    }
                }
            }
            catch (Exception ex)
            {
                model.AddError("alert-danger", ex.Message);
            }
        }

        public static string FormatarData(string str, int style)
        {
            if (!string.IsNullOrEmpty(str))
            {
                if (DateTime.TryParse(str, out DateTime dt))
                {
                    return FormatarData(dt, style);
                }
            }

            return string.Empty;
        }

        public static string FormatarData(DateTime dt, int style)
        {
            switch (style)
            {
                case 120:
                    return dt.ToString("yyyy-MM-dd HH:mm:ss");

                case 126:
                    return dt.ToString("yyyy-MM-ddTHH:mm:ss");

                case 103:
                    return dt.ToString("dd/MM/yyyy");

                case 23:
                    return dt.ToString("yyyy-MM-dd");

                case 108:
                    return dt.ToString("HH:mm:ss");

                case 200:
                    return dt.ToString("dd/MM/yyyy HH:mm:ss");

                case 201:
                    return dt.ToString("dd/MM/yyyy") + " às " + dt.ToString("HH:mm:ss");

                default:
                    break;
            }

            return string.Empty;
        }

        public static void CriaArquivo(string caminhoFisico, string pdfBase64)
        {
            using (FileStream stream = File.Create(caminhoFisico))
            {
                byte[] byteArray = Convert.FromBase64String(pdfBase64);
                stream.Write(byteArray, 0, byteArray.Length);
            }
        }

        public static string RetornaNumeroExtenso(int valor)
        {
            string expressao = string.Empty;
            string separador = " e ";

            if (valor < 20)
            {
                expressao = RetornaValorString(valor);
            }

            if (valor > 19)
            {
                int len = valor.ToString().Length;

                if (len == 2)
                {
                    int ValorPrimario = int.Parse(valor.ToString().Substring(0, 1));
                    int ValorSecundario = int.Parse(valor.ToString().Substring(1, 1));
                    ValorPrimario = ValorPrimario * 10;
                    expressao = RetornaValorString(ValorPrimario) + (ValorSecundario > 0 ? separador + RetornaValorString(ValorSecundario) : "");
                }
                else if (len == 3)
                {
                    int ValorPrimario = int.Parse(valor.ToString().Substring(0, 1));
                    int ValorSecundario = int.Parse(valor.ToString().Substring(1, 1));
                    int ValorTerciario = int.Parse(valor.ToString().Substring(2, 1));

                    ValorPrimario = ValorPrimario * 100;
                    ValorSecundario = ValorSecundario * 10;

                    expressao = RetornaValorString(ValorPrimario)
                              + (ValorSecundario > 0 ? separador + RetornaValorString(ValorSecundario) : "")
                              + (ValorTerciario > 0 ? separador + RetornaValorString(ValorTerciario) : "");
                }
            }

            return expressao;
        }

        private static string RetornaValorString(int identificador)
        {
            switch (identificador)
            {
                case 1: return "Um";
                case 2: return "Dois";
                case 3: return "Três";
                case 4: return "Quatro";
                case 5: return "Cinco";
                case 6: return "Seis";
                case 7: return "Sete";
                case 8: return "Oito";
                case 9: return "Nove";

                case 10: return "Dez";
                case 11: return "Onze";
                case 12: return "Doze";
                case 13: return "Treze";
                case 14: return "Quatorze";
                case 15: return "Quinze";
                case 16: return "Dezesseis";
                case 17: return "Dezessete";
                case 18: return "Dezoito";
                case 19: return "Dezenove";

                case 20: return "Vinte";
                case 30: return "Trinta";
                case 40: return "Quarenta";
                case 50: return "Cinquenta";
                case 60: return "Sessenta";
                case 70: return "Setenta";
                case 80: return "Oitenta";
                case 90: return "Noventa";

                case 100: return "Cento";
                case 200: return "Duzentos";
                case 300: return "Trezentos";
                case 400: return "Quatrocentos";
                case 500: return "Quinhentos";
                case 600: return "Seiscentos";
                case 700: return "Setecentos";
                case 800: return "Oitocentos";
                case 900: return "Novecentos";

                default: return "";
            }

        }

        public static string StrCompletaComZero(string expressao, int quantidadeDigitos)
        {
            if (expressao != null)
            {
                expressao = expressao.Trim().Replace(" ", "");

                return expressao.Length < quantidadeDigitos ? expressao.PadLeft(quantidadeDigitos, '0') : expressao;
            }
            else
            {
                return expressao;
            }
        }

        public static bool ValidarCamposRegex(string codigoTipoObservacaoRenavamWs, string codigoProcesso,string obrigatoriedadeCodigoProcesso, string regexCodigoProcesso,
        string identificacaoRelacionada, string obrigatoriedadeIdentificacaoRelacionada, string regexIdentificacaoRelacionada,
        string valorNumerico, string obrigatoriedadeValorNumerico, string regexValorNumerico,
        string valorTexto, string obrigatoriedadeValorTexto, string regexValorTexto, string regraValorTexto,
        ModelStateDictionary model
        )
        {
            bool retorno = true;
            Regex rx;
            MatchCollection matches;

            if (!String.IsNullOrEmpty(obrigatoriedadeCodigoProcesso) && obrigatoriedadeCodigoProcesso != "P")
            {
                if (obrigatoriedadeCodigoProcesso == "O" && codigoProcesso == null)
                {
                    model.AddError("codigoProcesso", "campo de preenchimento obrigatório");
                    retorno = false;
                }
                else if (regexCodigoProcesso != null && codigoProcesso != null)
                {
                    rx = new Regex(@regexCodigoProcesso, RegexOptions.Compiled | RegexOptions.IgnoreCase);

                    // Find matches.
                    matches = rx.Matches(codigoProcesso);


                    if (matches.Count == 0)
                    {
                        model.AddError("codigoProcesso", "Codigo inválido");
                        retorno = false;
                    }
                }
            }

            if (!String.IsNullOrEmpty(obrigatoriedadeIdentificacaoRelacionada) && obrigatoriedadeIdentificacaoRelacionada != "P")
            {
                if (obrigatoriedadeIdentificacaoRelacionada == "O" && identificacaoRelacionada == null)
                {
                    model.AddError("identificacaoRelacionada", "campo de preenchimento obrigatório");
                    retorno = false;
                }
                else if (regexIdentificacaoRelacionada != null && identificacaoRelacionada != null)
                {
                    rx = new Regex(@regexIdentificacaoRelacionada, RegexOptions.Compiled | RegexOptions.IgnoreCase);

                    // Find matches.
                    matches = rx.Matches(identificacaoRelacionada);


                    if (matches.Count == 0)
                    {
                        model.AddError("identificacaoRelacionada", "Identificação inválida");
                        retorno = false;
                    }
                }
            }

            if (!String.IsNullOrEmpty(obrigatoriedadeValorNumerico) && obrigatoriedadeValorNumerico != "P")
            {

                if (obrigatoriedadeValorNumerico == "O" && valorNumerico == null)
                {
                    model.AddError("valorNumerico", "campo de preenchimento obrigatório");
                    retorno = false;
                }
                else if (regexValorNumerico != null && valorNumerico != null)
                {
                    //if (codigoTipoObservacaoRenavamWs == "008008")//taque suplementar
                    //{
                    //    valorNumerico = valorNumerico + ".00";
                    //}

                    rx = new Regex(@regexValorNumerico, RegexOptions.Compiled | RegexOptions.IgnoreCase);

                    matches = rx.Matches(valorNumerico);

                    if (matches.Count == 0)
                    {
                        model.AddError("valorNumerico", "valor inválido");
                        retorno = false;
                    }
                }
            }

            if (!String.IsNullOrEmpty(obrigatoriedadeValorTexto) && obrigatoriedadeValorTexto != "P")
            {
                if (obrigatoriedadeValorTexto == "O" && valorTexto == null)
                {
                    model.AddError("valorTexto", "campo de preenchimento obrigatório");
                    retorno = false;
                }
                else if (regexValorTexto != null && valorTexto != null)
                {
                    //if (regraValorTexto == "DATA-VALIDA")
                    //{
                    //    DateTime date = DateTime.Parse(valorTexto);
                    //    valorTexto = date.ToString("dd-MM-yyyy");
                    //}

                    rx = new Regex(@regexValorTexto, RegexOptions.Compiled | RegexOptions.IgnoreCase);

                    matches = rx.Matches(valorTexto);

                    if (matches.Count == 0)
                    {
                        model.AddError("valorTexto", "campo inválido");
                        retorno = false;
                    }
                }
            }

            if (retorno == false)
            {
                model.AddError("alert-warning", "Por favor, verifique o formulário");
            }

            return retorno;

        }
    }
}