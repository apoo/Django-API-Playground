from django import template
from apiplayground.forms import build_url_form, build_data_form,build_auth_header_form

register = template.Library()


@register.assignment_tag()
def get_global_forms(schema):
    data_parameter_form = build_data_form(schema.get("parameters", []))

    return {
        "data_parameter_form": data_parameter_form
    }


@register.assignment_tag()
def get_endpoint_forms(endpoint):
    url_parameter_form = build_url_form(endpoint.get("url", ""))
    data_parameter_form = build_data_form(endpoint.get("parameters", []))
    data_parameter_auth_header = build_auth_header_form(endpoint.get("headers", []))

    return {
        "url_parameter_form": url_parameter_form,
        "data_parameter_form": data_parameter_form,
        "data_parameter_auth_header": data_parameter_auth_header
    }


@register.filter()
def render_url(url):
    """
    Removes GET parameters from URL.
    """
    return url.split("?")[0]
