Feature: Validimi i Çmimit të Produktit
  Si administrator i dyqanit
  Unë dua të kem validim për çmimet e produkteve
  Në mënyrë që të siguroj çmime të arsyeshme dhe konkurruese

  Background:
    Given Jam i kyçur si administrator
    And Jam në faqen e menaxhimit të produkteve

  Scenario: Shtimi i një produkti me çmim të vlefshëm
    When Unë fut një çmim prej 25.99€
    Then Forma duhet të pranojë çmimin
    And Nuk duhet të shoh gabime validimi

  Scenario: Shtimi i një produkti me çmim shumë të ulët
    When Unë fut një çmim prej 0.50€
    Then Forma duhet të tregojë një gabim validimi
    And Duhet të shoh një mesazh që tregon minimum 1€ të kërkuar

  Scenario: Shtimi i një produkti me çmim shumë të lartë
    When Unë fut një çmim prej 1000€
    Then Forma duhet të tregojë një gabim validimi
    And Duhet të shoh një mesazh që tregon maksimum 500€ të lejuar 