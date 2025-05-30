Feature: Menaxhimi i kategorive
  Si administrator i dyqanit
  Dua të shtoj kategori të reja dhe të menaxhoj numrin e produkteve në secilën
  Në mënyrë që të organizoj më mirë produktet

  Background:
    Given Jam i kyçur si administrator
    And Jam në faqen e menaxhimit të produkteve

  Scenario: Shtimi i një kategorie të re
    When Unë shtoj një kategori të re me emrin "Lule të Bardha"
    Then Kategoria "Lule të Bardha" duhet të shfaqet në listë
