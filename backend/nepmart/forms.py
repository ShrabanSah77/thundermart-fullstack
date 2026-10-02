from django import forms


class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)


class CheckoutForm(forms.Form):
    name = forms.CharField()
    phone = forms.CharField()
    address = forms.CharField()
    payment_method = forms.ChoiceField(choices=[
        ('COD', 'Cash on Delivery')
    ])