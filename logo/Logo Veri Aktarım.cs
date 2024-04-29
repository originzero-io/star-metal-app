using System;
using System.Data;
using System.Data.SqlClient;

namespace WorkboxSpecial.Model
{
    class Logo
    {

        public int IntSaat(DateTime zaman)
        {
            string saat = Convert.ToString(zaman.Hour, 2);
            string dakika = Convert.ToString(zaman.Minute, 2);
            string saniye = Convert.ToString(zaman.Second, 2);
            string binary = saat.PadLeft(8, '0') + dakika.PadLeft(8, '0') + saniye.PadLeft(8, '0') + "00000000";
            int IntZaman = Convert.ToInt32(binary, 2);
            return IntZaman;
        }

        //? LG_FİRMANO_01_STFICHE adındaki tabloya bir kayıt eklemek (CariRef, İrsaliye Tarihi, İrsaliye Zamanı, Fiş No, Son ID)
        public int IrsaliyeBaslikEkle(int CariRef, DateTime Tarih)
        {
            int cevap = 0;
            using (SqlConnection baglanti = new SqlConnection(Program.logoConStr))
            {
                string firmaNo = Program.logoFirmaNo.PadLeft(3, '0');
                baglanti.Open();
                using (SqlCommand cmd = new SqlCommand($@"INSERT INTO [dbo].[LG_{firmaNo}_01_STFICHE]
           ([GRPCODE],[TRCODE],[IOCODE],[FICHENO],[DATE_],[FTIME],[DOCODE],[INVNO],[SPECODE],[CYPHCODE],[INVOICEREF],[CLIENTREF],[RECVREF],[ACCOUNTREF],[CENTERREF],[PRODORDERREF],[PORDERFICHENO]
           ,[SOURCETYPE],[SOURCEINDEX],[SOURCEWSREF],[SOURCEPOLNREF],[SOURCECOSTGRP],[DESTTYPE],[DESTINDEX],[DESTWSREF],[DESTPOLNREF],[DESTCOSTGRP],[FACTORYNR],[BRANCH],[DEPARTMENT],[COMPBRANCH]
           ,[COMPDEPARTMENT],[COMPFACTORY],[PRODSTAT],[DEVIR],[CANCELLED],[BILLED],[ACCOUNTED],[UPDCURR],[INUSE],[INVKIND],[ADDDISCOUNTS],[TOTALDISCOUNTS],[ADDEXPENSES]
           ,[TOTALEXPENSES],[TOTALDEPOZITO],[TOTALPROMOTIONS],[GENEXP1],[GENEXP2],[GENEXP3],[GENEXP4],[GENEXP5],[GENEXP6],[REPORTRATE],[REPORTNET],[EXTENREF]
           ,[PAYDEFREF],[PRINTCNT],[FICHECNT],[ACCFICHEREF],[CAPIBLOCK_CREATEDBY],[CAPIBLOCK_CREADEDDATE],[CAPIBLOCK_CREATEDHOUR],[CAPIBLOCK_CREATEDMIN],[CAPIBLOCK_CREATEDSEC],[CAPIBLOCK_MODIFIEDBY]
           ,[CAPIBLOCK_MODIFIEDDATE],[CAPIBLOCK_MODIFIEDHOUR],[CAPIBLOCK_MODIFIEDMIN],[CAPIBLOCK_MODIFIEDSEC],[SALESMANREF],[CANCELLEDACC],[SHPTYPCOD],[SHPAGNCOD],[TRACKNR],[GENEXCTYP],[LINEEXCTYP]
           ,[TRADINGGRP],[TEXTINC],[SITEID],[RECSTATUS],[ORGLOGICREF],[WFSTATUS],[SHIPINFOREF],[DISTORDERREF],[SENDCNT],[DLVCLIENT],[DOCTRACKINGNR],[ADDTAXCALC],[TOTALADDTAX],[UGIRTRACKINGNO],[QPRODFCREF]
           ,[VAACCREF],[VACENTERREF],[ORGLOGOID],[FROMEXIM],[FRGTYPCOD],[TRCURR],[TRRATE],[TRNET],[EXIMWHFCREF],[EXIMFCTYPE],[MAINSTFCREF],[FROMORDWITHPAY],[PROJECTREF],[WFLOWCRDREF],[STATUS],[UPDTRCURR]
           ,[TOTALEXADDTAX],[AFFECTCOLLATRL],[DEDUCTIONPART1],[DEDUCTIONPART2],[GRPFIRMTRANS],[AFFECTRISK],[DISPSTATUS],[APPROVE],[APPROVEDATE],[CANTCREDEDUCT],[SHIPDATE],[SHIPTIME],[ENTRUSTDEVIR]
           ,[RELTRANSFCREF],[FROMTRANSFER],[GUID],[GLOBALID],[COMPSTFCREF],[COMPINVREF],[TOTALSERVICES],[CAMPAIGNCODE],[OFFERREF],[EINVOICETYP],[EINVOICE],[NOCALCULATE],[PRODORDERTYP],[QPRODFCTYP]
           ,[PRINTDATE],[PRDORDSLPLNRESERVE],[CONTROLINFO],[EDESPATCH],[DOCDATE],[DOCTIME],[EDESPSTATUS],[PROFILEID],[DELIVERYCODE],[DESTSTATUS],[CANCELEXP],[UNDOEXP],[CANCELDATE],[CREATEWHERE]
           ,[PUBLICBNACCREF],[ACCEPTEINVPUBLIC],[VATEXCEPTCODE],[VATEXCEPTREASON],[ATAXEXCEPTCODE],[ATAXEXCEPTREASON],[TAXFREECHX],[MNTORDERFREF],[PRINTEDDESPFCNO],[OKCFICHE]
           ,[TOTALDISCOUNTED],[TOTALVAT],[GROSSTOTAL],[NETTOTAL])
            VALUES (2,8,3,@FisNo,@IrsaliyeTarihi,@IrsaliyeZamani,@FisNo,'','','',0,@CariRef,0,0,0,0,'',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'','','','','','',0,0,0,0,0,0,0
           ,0,GETDATE(),0,0,0,0,GETDATE(),0,0,0,0,0,'','','',2,0,'',0,0,2,0,0,0,0,0,0,'',0,0,0,0,0,0,'',0,'',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,NULL,0,@IrsaliyeTarihi,@IrsaliyeZamani,0,0,0,'','',0,0,0,0,0,0,0,0,0,0,NULL,0
           ,0,0,@IrsaliyeTarihi,@IrsaliyeZamani,0,2,'',0,'','',NULL,0,0,0,0,'','','',NULL,0,'',0,0,0,0,0)  SELECT @SonID = SCOPE_IDENTITY()", baglanti))
                {
                    cmd.Parameters.Add("@CariRef", SqlDbType.Int).Value = CariRef;
                    cmd.Parameters.Add("@IrsaliyeTarihi", SqlDbType.DateTime).Value = Tarih;
                    cmd.Parameters.Add("@IrsaliyeZamani", SqlDbType.Int).Value = IntSaat(DateTime.Now);
                    cmd.Parameters.Add("@FisNo", SqlDbType.NVarChar).Value = IrsaliyeFisNo();
                    cmd.Parameters.Add("@SonID", SqlDbType.Int).Direction = ParameterDirection.Output;
                    cmd.ExecuteNonQuery();
                    cevap = Convert.ToInt32(cmd.Parameters["@SonID"].Value.ToString());
                }
                return cevap;
            }
        }

        //? LG_FİRMANO_01_STLINE adındaki tabloya bir kayıt eklemek (MalzemeRef, IrsaliyeTarihi, FişRef, SiraNo, CariRef, Miktar, Ay, Yıl, Son ID)
        public int IrsaliyeSatirEkle(int MalzemeRef, DateTime IrsaliyeTarihi, int FisRef, int SiraNo, int CariRef, decimal Miktar)
        {
            string firmaNo = Program.logoFirmaNo.PadLeft(3, '0');
            int cevap = 0;
            using (SqlConnection baglanti = new SqlConnection(Program.logoConStr))
            {
                baglanti.Open();
                using (SqlCommand cmd = new SqlCommand($@"INSERT INTO [dbo].[LG_{firmaNo}_01_STLINE]
           ([STOCKREF],[LINETYPE],[PREVLINEREF],[PREVLINENO],[DETLINE],[TRCODE],[DATE_],[FTIME],[GLOBTRANS],[CALCTYPE],[PRODORDERREF],[SOURCETYPE],[SOURCEINDEX],[SOURCECOSTGRP],[SOURCEWSREF],[SOURCEPOLNREF]
            ,[DESTTYPE],[DESTINDEX],[DESTCOSTGRP],[DESTWSREF],[DESTPOLNREF],[FACTORYNR],[IOCODE],[STFICHEREF],[STFICHELNNO],[INVOICEREF],[INVOICELNNO],[CLIENTREF],[ORDTRANSREF],[ORDFICHEREF],[CENTERREF]
,[ACCOUNTREF],[VATACCREF],[VATCENTERREF],[PRACCREF],[PRCENTERREF],[PRVATACCREF],[PRVATCENREF],[PROMREF],[PAYDEFREF],[SPECODE],[DELVRYCODE],[AMOUNT],[PRICE],[TOTAL],[PRCURR],[PRPRICE],[TRCURR],[TRRATE],
[REPORTRATE],[DISTCOST],[DISTDISC],[DISTEXP],[DISTPROM],[DISCPER],[LINEEXP],[UOMREF],[USREF],[UINFO1],[UINFO2],[UINFO3],[UINFO4],[UINFO5],[UINFO6],[UINFO7],[UINFO8],[PLNAMOUNT],[VATINC],[VAT],[VATAMNT],[VATMATRAH]
,[BILLEDITEM],[BILLED],[CPSTFLAG],[RETCOSTTYPE],[SOURCELINK],[RETCOST],[RETCOSTCURR],[OUTCOST],[OUTCOSTCURR],[RETAMOUNT],[FAREGREF],[FAATTRIB],[CANCELLED],[LINENET],[DISTADDEXP],[FADACCREF],[FADCENTERREF]
,[FARACCREF],[FARCENTERREF],[DIFFPRICE],[DIFFPRCOST],[DECPRDIFF],[LPRODSTAT],[PRDEXPTOTAL],[DIFFREPPRICE],[DIFFPRCRCOST],[SALESMANREF],[FAPLACCREF],[FAPLCENTERREF],[OUTPUTIDCODE],[DREF],[COSTRATE],[XPRICEUPD]
,[XPRICE],[XREPRATE],[DISTCOEF],[TRANSQCOK],[SITEID],[RECSTATUS],[ORGLOGICREF],[WFSTATUS],[POLINEREF],[PLNSTTRANSREF],[NETDISCFLAG],[NETDISCPERC],[NETDISCAMNT],[VATCALCDIFF],[CONDITIONREF],[DISTORDERREF]
,[DISTORDLINEREF],[CAMPAIGNREFS1],[CAMPAIGNREFS2],[CAMPAIGNREFS3],[CAMPAIGNREFS4],[CAMPAIGNREFS5],[POINTCAMPREF],[CAMPPOINT],[PROMCLASITEMREF],[CMPGLINEREF],[PLNSTTRANSPERNR],[PORDCLSPLNAMNT],[VENDCOMM]
,[PREVIOUSOUTCOST],[COSTOFSALEACCREF],[PURCHACCREF],[COSTOFSALECNTREF],[PURCHCENTREF],[PREVOUTCOSTCURR],[ABVATAMOUNT],[ABVATSTATUS],[PRRATE],[ADDTAXRATE],[ADDTAXCONVFACT],[ADDTAXAMOUNT],[ADDTAXPRCOST]
,[ADDTAXRETCOST],[ADDTAXRETCOSTCURR],[GROSSUINFO1],[GROSSUINFO2],[ADDTAXPRCOSTCURR],[ADDTAXACCREF],[ADDTAXCENTERREF],[ADDTAXAMNTISUPD],[INFIDX],[ADDTAXCOSACCREF],[ADDTAXCOSCNTREF],[PREVIOUSATAXPRCOST]
,[PREVATAXPRCOSTCURR],[PRDORDTOTCOEF],[DEMPEGGEDAMNT],[STDUNITCOST],[STDRPUNITCOST],[COSTDIFFACCREF],[COSTDIFFCENREF],[TEXTINC],[ADDTAXDISCAMOUNT],[ORGLOGOID],[EXIMFICHENO],[EXIMFCTYPE],[TRANSEXPLINE]
,[INSEXPLINE],[EXIMWHFCREF],[EXIMWHLNREF],[EXIMFILEREF],[EXIMPROCNR],[EISRVDSTTYP],[MAINSTLNREF],[MADEOFSHRED],[FROMORDWITHPAY],[PROJECTREF],[STATUS],[DORESERVE],[POINTCAMPREFS1],[POINTCAMPREFS2],[POINTCAMPREFS3]
,[POINTCAMPREFS4],[CAMPPOINTS1],[CAMPPOINTS2],[CAMPPOINTS3],[CAMPPOINTS4],[CMPGLINEREFS1],[CMPGLINEREFS2],[CMPGLINEREFS3],[CMPGLINEREFS4],[PRCLISTREF],[PORDSYMOUTLN],[MONTH_],[YEAR_],[EXADDTAXRATE]
,[EXADDTAXCONVF],[EXADDTAXAREF],[EXADDTAXCREF],[OTHRADDTAXAREF],[OTHRADDTAXCREF],[EXADDTAXAMNT],[AFFECTCOLLATRL],[ALTPROMFLAG],[EIDISTFLNNR],[EXIMTYPE],[VARIANTREF],[CANDEDUCT],[OUTREMAMNT],[OUTREMCOST]
,[OUTREMCOSTCURR],[REFLVATACCREF],[REFLVATOTHACCREF],[PARENTLNREF],[AFFECTRISK],[INEFFECTIVECOST],[ADDTAXVATMATRAH],[REFLACCREF],[REFLOTHACCREF],[CAMPPAYDEFREF],[FAREGBINDDATE],[RELTRANSLNREF],[FROMTRANSFER]
,[COSTDISTPRICE],[COSTDISTREPPRICE],[DIFFPRICEUFRS],[DIFFREPPRICEUFRS],[OUTCOSTUFRS],[OUTCOSTCURRUFRS],[DIFFPRCOSTUFRS],[DIFFPRCRCOSTUFRS],[RETCOSTUFRS],[RETCOSTCURRUFRS],[OUTREMCOSTUFRS],[OUTREMCOSTCURRUFRS]
,[INFIDXUFRS],[ADJPRICEUFRS],[ADJREPPRICEUFRS],[ADJPRCOSTUFRS],[ADJPRCRCOSTUFRS],[COSTDISTPRICEUFRS],[COSTDISTREPPRICEUFRS],[PURCHACCREFUFRS],[PURCHCENTREFUFRS],[COSACCREFUFRS],[COSCNTREFUFRS],[PROUTCOSTUFRSDIFF]
,[PROUTCOSTCRUFRSDIFF],[UNDERDEDUCTLIMIT],[GLOBALID],[DEDUCTIONPART1],[DEDUCTIONPART2],[GUID],[SPECODE2],[OFFERREF],[OFFTRANSREF],[VATEXCEPTREASON],[PLNDEFSERILOTNO],[PLNUNRSRVAMOUNT],[PORDCLSPLNUNRSRVAMNT]
,[LPRODRSRVSTAT],[FALINKTYPE],[DEDUCTCODE],[UPDTHISLINE],[VATEXCEPTCODE],[PORDERFICHENO],[QPRODFCREF],[RELTRANSFCREF],[ATAXEXCEPTREASON],[ATAXEXCEPTCODE],[PRODORDERTYP],[SUBCONTORDERREF],[QPRODFCTYP]
,[PRDORDSLPLNRESERVE],[INFDATE],[DESTSTATUS],[REGTYPREF],[FAPROFITACCREF],[FAPROFITCENTREF],[FALOSSACCREF],[FALOSSCENTREF],[CPACODE],[GTIPCODE],[PUBLICCOUNTRYREF],[QPRODITEMTYPE],[FUTMONTHCNT],[FUTMONTHBEGDATE]
,[QCTRANSFERREF],[QCTRANSFERAMNT],[FUTMONTHENDDATE],[KKEGACCREF],[KKEGCENTREF],[MNTORDERFREF],[FAKKEGAMOUNT],[MIDDLEMANEXPTYP],[EXPRACCREF],[EXPRCNTRREF],[KKEGVATACCREF],[KKEGVATCENTREF],[MARKINGTAGNO]
,[OWNER],[TCKTAXNR],[FUTMONTHBEGDATE_])
            VALUES
           (@MalzemeRef,0,0,0,0,8,@IrsaliyeTarihi,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,@FisRef,@SiraNo,0,0,@CariRef,0,0,0,0,0,0,0,0,0,0,0,0,'',''
           ,@Miktar,0,0,0,0,0,0,1,0,0,0,0,0,'',23,5,1,1,0,0,0,0,0,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
           ,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'',0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
		   ,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,@Ay,@Yil,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,NULL,
		   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'',0,0,'','',0,0,'','',0,0,0,0,'',0,'','',0,0,'','',0,0,0,0,null,0,0,0,0,0,0,'','',0,0,0,0,0,0,null,
		   0,0,0,0,0,0,0,0,0,'','','',null)  SELECT @SonID = SCOPE_IDENTITY()", baglanti))
                {
                    cmd.Parameters.Add("@MalzemeRef", SqlDbType.Int).Value = MalzemeRef;
                    cmd.Parameters.Add("@IrsaliyeTarihi", SqlDbType.DateTime).Value = IrsaliyeTarihi;
                    cmd.Parameters.Add("@FisRef", SqlDbType.Int).Value = FisRef;
                    cmd.Parameters.Add("@SiraNo", SqlDbType.Int).Value = SiraNo;
                    cmd.Parameters.Add("@CariRef", SqlDbType.Int).Value = CariRef;
                    cmd.Parameters.Add("@Miktar", SqlDbType.Float).Value = Convert.ToDouble(Miktar);
                    cmd.Parameters.Add("@Ay", SqlDbType.Int).Value = IrsaliyeTarihi.Month;
                    cmd.Parameters.Add("@Yil", SqlDbType.Int).Value = IrsaliyeTarihi.Year;
                    cmd.Parameters.Add("@SonID", SqlDbType.Int).Direction = ParameterDirection.Output;
                    cmd.ExecuteNonQuery();
                    cevap = Convert.ToInt32(cmd.Parameters["@SonID"].Value.ToString());
                }
            }

            return cevap;
        }

        //? LG_FİRMANO_ITEMS adındaki tablodan ilgili malzeme kodlu kaydı çekmek
        //? Malzeme Kodu = Sipariş Numarası
        public int MalzemeRef(string MalzemeKodu)
        {
            string firmaNo = Program.logoFirmaNo.PadLeft(3, '0');
            int cevap = 0;
            string SorguMetni = $@"SELECT LOGICALREF FROM LG_{firmaNo}_ITEMS WHERE CODE = '{MalzemeKodu}'";
            using (SqlConnection baglanti = new SqlConnection(Program.logoConStr))
            {
                baglanti.Open();
                using (SqlCommand cmd = new SqlCommand(SorguMetni, baglanti))
                {
                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            cevap = Convert.ToInt32(dr[0].ToString());
                        }
                    }
                }
            }
            return cevap;
        }

        //? LG_FİRMANO_CLCARD adındaki tablodan ilgili vergi numarasına sahip kaydı çekmek
        public int CariRef(string VergiNumarasi)
        {
            string firmaNo = Program.logoFirmaNo.PadLeft(3, '0');
            int cevap = 0;
            string SorguMetni = $@"SELECT LOGICALREF FROM LG_{firmaNo}_CLCARD WHERE TAXNR = '{VergiNumarasi}'";
            using (SqlConnection baglanti = new SqlConnection(Program.logoConStr))
            {
                baglanti.Open();
                using (SqlCommand cmd = new SqlCommand(SorguMetni, baglanti))
                {
                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            cevap = Convert.ToInt32(dr[0].ToString());
                        }
                    }
                }
            }
            return cevap;
        }


        //? LG_FİRMANO_01_STFICHE isimli tablodan "NY" ifadesi ile başlayan en son kaydı çek, eğer yoksa default bir fiş no ata  
        public string IrsaliyeFisNo()
        {
            string firmaNo = Program.logoFirmaNo.PadLeft(3, '0');
            string sonFisNo = string.Empty;
            string fisNo = string.Empty;
            string SorguMetni = $@"SELECT TOP 1 FICHENO FROM LG_{firmaNo}_01_STFICHE WHERE FICHENO LIKE 'NY%' ORDER BY FICHENO DESC";
            using (SqlConnection baglanti = new SqlConnection(Program.logoConStr))
            {
                baglanti.Open();
                using (SqlCommand cmd = new SqlCommand(SorguMetni, baglanti))
                {
                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            sonFisNo = dr[0].ToString();
                            fisNo = "NY-" + (Convert.ToInt32(sonFisNo.Split('-')[1])+1).ToString().PadLeft(5, '0');
                            return fisNo;
                        }
                        else
                        {
                            fisNo = "NY-00001";
                            return fisNo;
                        }
                    }
                }
            }
        }

    }
}
