
import { test, expect, type Page } from '@playwright/test';

export class LoginPage {

    constructor(private page: Page) {}

    async login(username: string, password: string) {

        await this.page
            .getByPlaceholder('Username')
            .fill(username);

        await this.page
            .getByPlaceholder('Password')
            .fill(password);

        await this.page
            .getByRole('button', { name: 'Login' })
            .click();
    }
}


test.describe('Testes de Login', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {

        await page.goto('https://www.saucedemo.com/');

        loginPage = new LoginPage(page);
    });


    test('Login com usuário válido', async ({ page }) => {

        await loginPage.login(
            'standard_user',
            'secret_sauce'
        );

        await expect(page).toHaveURL(
            /inventory.html/
        );

        await expect(
            page.getByText('Products')
        ).toBeVisible();
    });


    test('Login com usuário inválido', async ({ page }) => {

        await loginPage.login(
            'usuario_invalido',
            'senha_invalida'
        );

        await expect(
            page.getByText(
                'Epic sadface: Username and password do not match any user in this service'
            )
        ).toBeVisible();
    });


    test('Login com usuário bloqueado', async ({ page }) => {

        await loginPage.login(
            'locked_out_user',
            'secret_sauce'
        );

        await expect(
            page.getByText(
                'Epic sadface: Sorry, this user has been locked out.'
            )
        ).toBeVisible();
    });

});

test.describe('Testes de Produtos', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {

        await page.goto('https://www.saucedemo.com/');

        loginPage = new LoginPage(page);

        await loginPage.login(
            'standard_user',
            'secret_sauce'
        );
    });


    test('Exibir lista de produtos', async ({ page }) => {

        await expect(
            page.getByText('Products')
        ).toBeVisible();

        await expect(
            page.locator('.inventory_item')
        ).toHaveCount(6);
    });


    test('Adicionar produto ao carrinho', async ({ page }) => {

        await page
            .getByRole('button', {
                name: 'Add to cart'
            })
            .first()
            .click();

        await expect(
            page.locator('.shopping_cart_badge')
        ).toHaveText('1');
    });

});



    











    













