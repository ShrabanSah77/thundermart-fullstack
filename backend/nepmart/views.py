import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import CheckoutForm, LoginForm
from .models import Customer, Category, Product, Order, OrderItem
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

@csrf_exempt
def login_api(request):
    if request.method != 'POST':
        return JsonResponse(
            {
                'error': 'POST request required.'
            },
            status=405
        )

    try:
        data = json.loads(request.body)

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse(
                {
                    'error': 'Username and password are required.'
                },
                status=400
            )

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            return JsonResponse(
                {
                    'error': 'Invalid username or password.'
                },
                status=401
            )

        login(request, user)

        return JsonResponse(
            {
                'success': True,
                'message': 'Login successful.',
                'username': user.username
            },
            status=200
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {
                'error': 'Invalid JSON data.'
            },
            status=400
        )
    
# Current User view

@login_required
def current_user_api(request):
    return JsonResponse({
        'logged_in': True,
        'username': request.user.username,
        'email': request.user.email,
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

@csrf_exempt
def register_api(request):

    if request.method != 'POST':
        return JsonResponse(
            {
                'error': 'POST request required.'
            },
            status=405
        )

    try:
        data = json.loads(request.body)

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return JsonResponse(
                {
                    'error': 'All fields are required.'
                },
                status=400
            )

        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {
                    'error': 'Username already exists.'
                },
                status=400
            )

        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {
                    'error': 'Email already exists.'
                },
                status=400
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        return JsonResponse(
            {
                'success': True,
                'message': 'Account created successfully.'
            },
            status=201
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {
                'error': 'Invalid JSON data.'
            },
            status=400
        )

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

@csrf_exempt
def logout_api(request):
    if request.method != 'POST':
        return JsonResponse(
            {
                'error': 'POST request required.'
            },
            status=405
        )

    logout(request)

    return JsonResponse({
        'success': True,
        'message': 'Logout successful.'
    })

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

    # React Checkout API

@csrf_exempt
@login_required
def checkout_api(request):

    if request.method != 'POST':
        return JsonResponse(
            {
                'error': 'POST request required.'
            },
            status=405
        )

    try:
        data = json.loads(request.body)

        name = data.get('name')
        phone = data.get('phone')
        address = data.get('address')
        payment_method = data.get('payment_method')
        cart = data.get('cart', [])

        # Validate customer information
        if not name or not phone or not address:
            return JsonResponse(
                {
                    'error': 'Name, phone and address are required.'
                },
                status=400
            )

        # Validate payment method
        if payment_method not in ['COD', 'CARD']:
            return JsonResponse(
                {
                    'error': 'Invalid payment method.'
                },
                status=400
            )

        # Make sure cart is not empty
        if not cart:
            return JsonResponse(
                {
                    'error': 'Your cart is empty.'
                },
                status=400
            )

        total = 0
        order_items = []

        # Process cart products
        for item in cart:

            product_id = item.get('product_id')
            quantity = int(item.get('quantity', 0))

            if not product_id or quantity <= 0:
                return JsonResponse(
                    {
                        'error': 'Invalid cart item.'
                    },
                    status=400
                )

            product = get_object_or_404(
                Product,
                id=product_id
            )

            subtotal = product.price * quantity
            total += subtotal

            order_items.append({
                'product': product,
                'quantity': quantity,
                'price': product.price
            })

        # Create order
        order = Order.objects.create(
            user=request.user,
            name=name,
            phone=phone,
            address=address,
            payment_method=payment_method,
            total_price=total
        )

        # Create order items
        for item in order_items:

            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price=item['price']
            )

        # Clear Django session cart
        request.session['cart'] = {}
        request.session.modified = True

        # Return JSON to React
        return JsonResponse(
            {
                'success': True,
                'message': 'Order placed successfully.',
                'order_id': order.id,
                'total_price': total
            },
            status=200
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {
                'error': 'Invalid JSON data.'
            },
            status=400
        )

    except Exception as e:
        return JsonResponse(
            {
                'error': str(e)
            },
            status=500
        )

# React API - Products

def product_api(request):
    products = Product.objects.select_related(
        'category'
    ).all().order_by('-created_at')

    data = []

    for product in products:

        final_price = float(product.price)

        if product.discount:
            final_price = final_price - (
                final_price * float(product.discount) / 100
            )

        data.append({
            'id': product.id,
            'name': product.name,
            'price': float(product.price),
            'discount': float(product.discount),
            'final_price': round(final_price, 2),
            'description': product.description,
            'brand': product.brand,
            'stock': product.stock,
            'image_url': product.image_url,
            'category': {
                'id': product.category.id if product.category else None,
                'name': product.category.name if product.category else None,
            },
        })

    return JsonResponse({
        'products': data
    })


def category_api(request):
    categories = Category.objects.all().order_by('name')

    data = []

    for category in categories:
        data.append({
            'id': category.id,
            'name': category.name,
            'description': category.description,
            'product_count': category.products.count(),
        })

    return JsonResponse({
        'categories': data
    })