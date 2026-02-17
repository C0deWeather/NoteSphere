"""This module contains dependencies for all endpoints"""
from fastapi import Request


def get_user_repo(request: Request):
    return request.app.state.user_repo
    