using System.Configuration;
using System.Web;

/// <summary>
/// Summary description for CaminhoArquivo
/// </summary>
public static class CaminhoArquivo
{

    private static string GetCaminhoFisico(string path)
    {
        return HttpContext.Current.Request.MapPath(path);
    }

    public static string GetCaminhoLogicoPastaAvatar()
    {
        return "/ArquivosAvatar/";
    }

    public static string GetCaminhoFisicoPastaAvatar()
    {
        return GetCaminhoFisico(GetCaminhoLogicoPastaUpload());
    }

    public static string GetCaminhoLogicoPastaUpload()
    {
        return "/ArquivosUpload/";
    }
    public static string GetCaminhoFisicoPastaUpload()
    {
        return GetCaminhoFisico(GetCaminhoLogicoPastaUpload());
    }

    public static string GetCaminhoLogicoPastaInstalador()
    {
        return "/ArquivosInstalador/";
    }

    public static string GetCaminhoFisicoPastaInstalador()
    {
        return GetCaminhoFisico(GetCaminhoLogicoPastaInstalador());
    }

    public static string GetCaminhoLogicoPastaProcesso() 
    {
        return "/ArquivosProcessos/";
    }

    public static string GetCaminhoFisicoPastaProcesso()
    {
        return GetCaminhoFisico(GetCaminhoLogicoPastaProcesso());
    }

    public static string GetCaminhoLogicoPastaArquivoChamado()
    {
        return "/ArquivosChamados/";
    }
    public static string GetCaminhoFisicoPastaArquivoChamado()
    {
        return GetCaminhoFisico(GetCaminhoLogicoPastaArquivoChamado());
    }

    public static string GetCaminhoLogicoPastaImagem()
    {
        return "~/Assets/img/";
    }
    public static string GetCaminhoFisicoPastaImagem()
    {
        // A pasta de imagem é diferente porque a pasta assets é relativa.
        return HttpContext.Current.Request.MapPath(GetCaminhoLogicoPastaImagem());
    }

    public static string GetCaminhoLogicoPastaVideo()
    {
        return "/ArquivosVideos/";
    }
    public static string GetCaminhoFisicoPastaVideo()
    {
        return GetCaminhoFisico(GetCaminhoLogicoPastaVideo());
    }

    public static string GetCaminhoLogicoPastaNoticias()
    {
        return ConfigurationManager.AppSettings.Get("PastaNoticias");
    }
    public static string GetCaminhoFisicoPastaNoticias()
    {
        return GetCaminhoFisico(GetCaminhoLogicoPastaNoticias());
    }

}