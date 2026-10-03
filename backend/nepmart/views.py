from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import CheckoutForm, LoginForm
from .models import Customer, Product, Order, OrderItem
from django.contrib.auth.decorators import login_required

# Create your views here.
# Index View
def index(request):
    context = {'user_name': 'Shraban'}
    return render(request, 'index.html', context)

# Login View

def login_view(request):
    next_page = request.GET.get('next', '')  # default safe empty string

    if request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():
            user = authenticate(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password']
            )

            if user:
                login(request, user)

                next_page = request.POST.get('next')

                if next_page:
                    return redirect(next_page)

                return redirect('index')

    else:
        form = LoginForm()

    return render(request, 'signIn/login.html', {
        'form': form,
        'next': next_page
    })

# Register View

def register_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if not username or not email or not password:
            messages.error(request, 'All fields are required')
            return redirect('register') #Redirect to the register page
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'username already exists')
            return redirect('register') #Redirect to the register page

        else:
            User.objects.create_user(username = username, email=email, password=password)
            messages.success(request, 'Account created successfully')
            return redirect('login') #Redirect to the login page
        
    return render(request, 'signIn/register.html')

# Forgot password view

def forgot_password_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if password != confirm_password:
            messages.error(request, 'Passwords do not match.')
            return redirect('forgot_password')

        try:
            user = User.objects.get(username=username)
            user.set_password(password)
            user.save()

            messages.success(request, "Pasword reset successfully. Please login.")
            return redirect('login')  # Redirect to login page

        except User.DoesNotExist:
            messages.error(request, "Username not found.")
            return redirect('forgot_password')

    return render(request, 'signIn/forgot_password.html')


# Logout View

def logout_view(request):
    logout(request)
    return redirect('login')

# Customer View

def customer_list(request):
    customer = Customer.objects.all()
    return HttpResponse(f"{list(customer)}")

# Order View

@login_required
def my_orders(request):
    orders = Order.objects.filter(user = request.user)
    return render(request, 'product/my_orders.html', {'orders': orders})

# Add to cart view

def add_to_cart(request, product_id):

    cart = request.session.get('cart', {})

    product_id = str(product_id)

    if product_id in cart:
        cart[product_id] += 1
    else:
        cart[product_id] = 1

    request.session['cart'] = cart
    request.session.modified = True

    return redirect('cart')

# Increase item quantity

def increase_cart(request, product_id):
    cart = request.session.get('cart', {})
    if str(product_id) in cart:
        cart[str(product_id)] += 1
    request.session['cart'] = cart
    return redirect('cart')

# Decrease ietm quantity

def decrease_cart(request, product_id):
    cart = request.session.get('cart', {})
    if str(product_id) in cart:
        cart[str(product_id)] -= 1
        if cart[str(product_id)] <= 0:
            del cart[str(product_id)]

    request.session['cart'] = cart
    return redirect('cart')

# Cart View

def cart_view(request):

    cart = request.session.get('cart', {})

    items = []
    total = 0

    for product_id, quantity in cart.items():

        product = get_object_or_404(Product, id=product_id)

        subtotal = product.price * quantity

        total += subtotal

        items.append({
            'product': product,
            'quantity': quantity,
            'subtotal': subtotal
        })

    products = Product.objects.all()

    return render(request, 'product/cart.html', {
        'items': items,
        'total': total,
        'products': products
    })

# Remove from cart view

def remove_from_cart(request, product_id):
    cart = request.session.get('cart', {})

    if str(product_id) in cart:
        del cart[str(product_id)]

    request.session['cart'] = cart
    return redirect('cart')

# Checkout View

@login_required
def checkout(request):
    cart = request.session.get('cart', {})

    if not cart:
        return redirect('cart')

    cart_items = []
    total = 0

    for product_id, quantity in cart.items():
        product = get_object_or_404(Product, id=product_id)
        subtotal = product.price * quantity
        total += subtotal

        cart_items.append({
            'product': product,
            'quantity': quantity,
            'subtotal': subtotal
        })

    if request.method == 'POST':
        form = CheckoutForm(request.POST)

        if form.is_valid():
            name = form.cleaned_data['name']
            phone = form.cleaned_data['phone']
            address = form.cleaned_data['address']
            payment_method = form.cleaned_data['payment_method']

            order = Order.objects.create(
                user=request.user,
                name=name,
                phone=phone,
                address=address,
                payment_method=payment_method,
                total_price=total
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item['product'],
                    quantity=item['quantity'],
                    price=item['product'].price
                )

            request.session['cart'] = {}

            return render(request, 'product/order_success.html', {
                'order': order
            })

    else:
        form = CheckoutForm()

    return render(request, 'product/checkout.html', {
        'form': form,
        'cart_items': cart_items,
        'total': total
    })

# =========================
# React API - Products
# =========================

def product_api(request):
    products = Product.objects.all().order_by('-created_at')

    data = []

    for product in products:
        data.append({
            'id': product.id,
            'name': product.name,
            'price': float(product.price),
            'description': product.description,
        })

    return JsonResponse({
        'products': data
    })

