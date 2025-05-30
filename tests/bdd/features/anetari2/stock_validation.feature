Feature: Validimi i Sasisë në Stok
  Si administrator i dyqanit
  Unë dua të kem validim për sasinë në stok
  Në mënyrë që të menaxhoj efektivisht inventarin

  Background:
    Given Jam i kyçur si administrator
    And Jam në faqen e menaxhimit të produkteve

  Scenario: Shtimi i një produkti me sasi të vlefshme në stok
    When Unë fut një sasi prej 50 njesive
    Then Forma duhet të pranojë sasinë
    And Nuk duhet të shoh gabime validimi

  Scenario: Shtimi i një produkti me sasi negative
    When Unë fut një sasi prej -5 njesive
    Then Forma duhet të tregojë një gabim validimi
    And Duhet të shoh një mesazh që tregon që sasia duhet të jetë pozitive

  Scenario: Shtimi i një produkti me sasi shumë të madhe
    When Unë fut një sasi prej 10000 njesive
    Then Forma duhet të tregojë një gabim validimi
    And Duhet të shoh një mesazh që tregon maksimum 1000 njesive të lejuara 