using System.Web;

namespace AppCode.Dao
{
    /// <summary>
    /// Descrição resumida de Identificacao
    /// </summary>
    public class Identificacao
    {
        private string _Usuario;
        private string _IdSessao;
        private string _Sistema;
        private string _Modulo;
        private string _Pagina;

        public Identificacao()
        {
            _Usuario = GetUsuario();
            _IdSessao = GetIdSessao();

            string caminhoPagina = HttpContext.Current.Request.FilePath;

            string[] vetorcaminho = new string[5];
            char[] splitter = { '/' };

            vetorcaminho = caminhoPagina.Split(splitter);

            int count = vetorcaminho.Length;

            if (count - 3 >= 0)
            {
                _Sistema = vetorcaminho[count - 3];
            }

            if (count - 2 >= 0)
            {
                _Modulo = vetorcaminho[count - 2];
            }

            if (count - 1 >= 0)
            {
                _Pagina = vetorcaminho[count - 1].Split('.')[0];
            }
        }

        private string GetUsuario()
        {
            string val = null;

            if (HttpContext.Current.Session["op"] != null)
            {
                val = HttpContext.Current.Session["op"].ToString();
            }

            return val;
        }

        private string GetIdSessao()
        {
            string val = null;

            if (HttpContext.Current.Session["IdSessao"] != null)
            {
                val = HttpContext.Current.Session["IdSessao"].ToString();
            }

            return val;
        }

        public string Usuario
        {
            get { return _Usuario; }
        }

        public string IdSessao
        {
            get { return _IdSessao; }
        }

        public string Sistema
        {
            get { return _Sistema; }
        }

        public string Modulo
        {
            get { return _Modulo; }
        }

        public string Pagina
        {
            get { return _Pagina; }
        }
    }
}