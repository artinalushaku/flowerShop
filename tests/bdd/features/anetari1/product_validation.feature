Feature: Shtimi i një produkti
  Si administrator
  Dua të shtoj një produkt të ri
  Që të zgjeroj listën e produkteve

  Background:
    Given Jam i kyçur si administrator
    And Jam në faqen e menaxhimit të produkteve

  Scenario: Shtimi i thjeshtë i një produkti
    When Unë plotësoj formularin me emër, përshkrim, çmim, sasi dhe kategori
    And Klikoj butonin për të shtuar produktin
    Then Duhet të shfaqet mesazhi i suksesit
