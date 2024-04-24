// 

if (File.Exists(@"Config.json"))
                {
                    using (StreamReader r = new StreamReader(@"Config.json"))
                    {
                        string json = r.ReadToEnd();
                        DbConStr dbConStr = JsonConvert.DeserializeObject<DbConStr>(json);

                        string logoConStr = string.Empty;
                        string erpConStr = string.Empty;

                        SqlConnectionStringBuilder LogoConnStrBuilder = new SqlConnectionStringBuilder();
                        LogoConnStrBuilder.DataSource = dbConStr.sqlServerName;
                        LogoConnStrBuilder.UserID = dbConStr.sqlUserName;
                        LogoConnStrBuilder.Password = dbConStr.sqlPassword;
                        LogoConnStrBuilder.InitialCatalog = dbConStr.logoDatabaseName;
                        logoConStr = LogoConnStrBuilder.ToString();
                        Program.logoConStr = logoConStr;

                        SqlConnectionStringBuilder ErpConnStrBuilder = new SqlConnectionStringBuilder();
                        ErpConnStrBuilder.DataSource = dbConStr.sqlServerName;
                        ErpConnStrBuilder.UserID = dbConStr.sqlUserName;
                        ErpConnStrBuilder.Password = dbConStr.sqlPassword;
                        ErpConnStrBuilder.InitialCatalog = dbConStr.erpDatabaseName;
                        erpConStr = ErpConnStrBuilder.ToString();
                        Program.erpConStr = erpConStr;

                        Program.logoFirmaNo = dbConStr.logoFirmaNo;
                        Program.logoDonemNo = dbConStr.logoDonemNo;

                        frmAnaSayfa frm = new frmAnaSayfa();
                        frm.Show();
                        this.Hide();
                    }
                }
                else
                {
                    XtraMessageBox.Show("Veritabanı bağlantı dosyası bulunamadı.", Program.MesajBasligi, MessageBoxButtons.OK, MessageBoxIcon.Stop);
                    frmBaglantiAyarlari frm = new frmBaglantiAyarlari();
                    frm.GonderenSayfa = 1;
                    frm.Show();
                }